/**
 * The driver's side of the panel: today's work, and the walk-in.
 *
 * A driver is holding a phone next to a car with a customer waiting. That is
 * the whole design brief. Four buttons, one question per screen, and nothing
 * on any screen that the office could fill in afterwards.
 *
 * Quick Start exists because the alternative was a note on paper that reached
 * the office that evening -- by which time the odometer reading is a memory
 * and the customer has gone. Everything it collects is collected at the car,
 * where it is still true.
 */

(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const panel = $('panel-driver');
  if (!panel) return;                       // not a build with the driver tab

  /* ---- today's work ---------------------------------------------------- */

  let drvFilter = 'Confirmed';

  /** The day's bookings in the state asked for, newest first. */
  async function renderDriverList(status) {
    drvFilter = status;
    const title = $('drvListTitle');
    const wrap = $('drvList');
    if (!wrap) return;

    panel.querySelectorAll('[data-driver]').forEach((b) =>
      b.classList.toggle('is-on', b.dataset.driver === status));
    if (title) title.textContent = statusLabel(status);

    wrap.innerHTML = '<p class="detail-empty">Loading…</p>';
    let rows = [];
    try {
      rows = (await api.bookings.list(status)).bookings || [];
    } catch (err) {
      wrap.innerHTML = '<p class="detail-empty">Could not load. Pull down to try again.</p>';
      showError(err);
      return;
    }

    if (rows.length === 0) {
      wrap.innerHTML = `<p class="detail-empty">Nothing ${statusLabel(status).toLowerCase()}.</p>`;
      return;
    }

    // A row a thumb can hit, carrying only what tells one car from another.
    wrap.innerHTML = rows.map((b) => `
      <button type="button" class="driver-row" data-booking="${b.id}">
        <span class="driver-row-top">
          <span class="driver-row-id">${escapeHTML(b.booking_number)}</span>
          ${statusBadge(b.status)}
        </span>
        <span class="driver-row-who">${escapeHTML(b.customer_name || '')}</span>
        <span class="driver-row-car">${escapeHTML(b.vehicle_name || '')}
          · ${escapeHTML(b.vehicle_reg || '')}</span>
        <span class="driver-row-when">${formatDateTime(b.start_at)} → ${formatDateTime(b.return_at)}</span>
      </button>`).join('');

    wrap.querySelectorAll('[data-booking]').forEach((row) => {
      row.addEventListener('click', () => openBookingDetail(Number(row.dataset.booking)));
    });
  }

  /** The counts on the four cards. */
  async function refreshDriverCounts() {
    try {
      const all = (await api.bookings.list()).bookings || [];
      const by = (s) => all.filter((b) => b.status === s).length;
      if ($('drvUpcomingN')) $('drvUpcomingN').textContent = by('Confirmed');
      if ($('drvActiveN')) $('drvActiveN').textContent = by('Active');
      if ($('drvReturnN')) $('drvReturnN').textContent = by('Returned');
    } catch (e) { /* the list below says so too; no second error */ }
  }

  panel.querySelectorAll('[data-driver]').forEach((card) => {
    card.addEventListener('click', () => renderDriverList(card.dataset.driver));
  });

  window.renderDriverPanel = async function renderDriverPanel() {
    await Promise.all([refreshDriverCounts(), renderDriverList(drvFilter)]);
  };

  /* ---- the walk-in ----------------------------------------------------- */

  const overlay = $('qsOverlay');
  const form = $('qsForm');
  const LAST = 7;
  let step = 1;
  let vehicles = [];
  let chosen = null;

  const pane = (n) => form.querySelector(`.qs-pane[data-step="${n}"]`);
  const dt = (d, t) => (d && t ? `${d} ${t}` : '');

  function showStep(n) {
    step = n;
    for (let i = 1; i <= LAST; i++) pane(i).hidden = i !== n;
    $('qsStepOf').textContent = `Step ${n} of ${LAST}`;
    $('qsBarFill').style.width = `${(n / LAST) * 100}%`;
    clearFieldErrors(form);
    $('qsBack').hidden = n === 1;
    $('qsNext').hidden = n === LAST;
    $('qsGo').hidden = n !== LAST;
    fault('');
    // A phone keeps the previous screen's scroll position otherwise, which
    // on a short step leaves the question off the top.
    form.closest('.qs-modal')?.scrollTo({ top: 0 });
  }

  function fault(message) {
    const box = $('qsError');
    box.textContent = message;
    box.hidden = !message;
  }

  /** Days, the same way the booking form counts them. */
  function days() {
    const a = new Date(dt($('qsStartDate').value, $('qsStartTime').value).replace(' ', 'T'));
    const b = new Date(dt($('qsReturnDate').value, $('qsReturnTime').value).replace(' ', 'T'));
    if (Number.isNaN(+a) || Number.isNaN(+b) || b <= a) return 0;
    return Math.max(1, Math.ceil((b - a) / 86400000));
  }

  function updateDuration() {
    const d = days();
    $('qsDuration').textContent = d ? `${d} day${d === 1 ? '' : 's'}` : '';
  }
  ['qsStartDate', 'qsStartTime', 'qsReturnDate', 'qsReturnTime']
    .forEach((id) => $(id)?.addEventListener('change', updateDuration));

  /** The cars actually free for those times, as cards to tap. */
  async function loadVehicles() {
    const box = $('qsVehicles');
    box.innerHTML = '<p class="detail-empty">Checking what is free…</p>';
    chosen = null;
    $('qsVehicleId').value = '';
    try {
      vehicles = (await api.bookings.available(
        dt($('qsStartDate').value, $('qsStartTime').value),
        dt($('qsReturnDate').value, $('qsReturnTime').value),
      )).vehicles || [];
    } catch (err) {
      box.innerHTML = '<p class="detail-empty">Could not check availability.</p>';
      showError(err);
      return;
    }
    paintVehicles();
  }

  function paintVehicles() {
    const box = $('qsVehicles');
    const want = $('qsBodyType').value;
    const list = want ? vehicles.filter((v) => v.body_type === want) : vehicles;

    if (list.length === 0) {
      box.innerHTML = `<p class="detail-empty">No ${want || 'car'} is free for those times.
        Change the dates, or pick another type.</p>`;
      return;
    }

    // Registration number on every card: where a type has several, the
    // driver is choosing a particular car in front of them, not a model.
    box.innerHTML = list.map((v) => `
      <button type="button" class="qs-vehicle" data-vehicle="${v.id}">
        <span class="qs-vehicle-name">${escapeHTML(v.name)}</span>
        <span class="qs-vehicle-reg">${escapeHTML(v.reg_number || 'no reg. no.')}</span>
        <span class="qs-vehicle-meta">${escapeHTML(v.body_type || '')} ·
          ${v.seats || '?'} seats · ${escapeHTML(v.transmission || '')}</span>
        <span class="qs-vehicle-rate">${v.rate_daily ? formatINR(v.rate_daily) + ' a day' : 'rate not set'}</span>
      </button>`).join('');

    box.querySelectorAll('[data-vehicle]').forEach((card) => {
      card.addEventListener('click', () => {
        box.querySelectorAll('[data-vehicle]').forEach((c) => c.classList.remove('is-on'));
        card.classList.add('is-on');
        chosen = list.find((v) => v.id === Number(card.dataset.vehicle));
        $('qsVehicleId').value = chosen ? chosen.id : '';
        // The car's own rate card fills the money in, so the driver is
        // confirming figures rather than remembering them.
        if (chosen) {
          if (chosen.km_limit_per_day) $('qsKmLimit').value = chosen.km_limit_per_day;
          if (chosen.extra_km_rate) $('qsExtraKm').value = chosen.extra_km_rate;
          if (chosen.security_deposit) $('qsDeposit').value = chosen.security_deposit;
          if (chosen.rate_daily) $('qsRental').value = Math.round(chosen.rate_daily * days());
          updateBalance();
        }
      });
    });
  }

  $('qsBodyType')?.addEventListener('change', paintVehicles);

  function updateBalance() {
    const rental = Number($('qsRental').value) || 0;
    const advance = Number($('qsAdvance').value) || 0;
    const left = rental - advance;
    $('qsBalance').textContent = rental
      ? `${formatINR(rental)} agreed, ${formatINR(advance)} taken, ${formatINR(left)} still to pay.`
      : '';
  }
  ['qsRental', 'qsAdvance'].forEach((id) => $(id)?.addEventListener('input', updateBalance));

  $('qsPhotos')?.addEventListener('change', () => {
    const n = $('qsPhotos').files.length;
    $('qsPhotoCount').textContent = n ? `${n} photograph${n === 1 ? '' : 's'} chosen` : '';
  });

  /**
   * What each step insists on before it will let go.
   *
   * Returns the field at fault and what is wrong with it, rather than a
   * sentence on its own: the complaint goes against the field, where it can
   * be read and acted on in one place.
   */
  function stepFault() {
    const at = (id, message) => ({ id, message });

    if (step === 1) {
      if (!$('qsStartDate').value || !$('qsStartTime').value) {
        return at('qsStartDate', 'When is the car going out?');
      }
      if (!$('qsReturnDate').value || !$('qsReturnTime').value) {
        return at('qsReturnDate', 'When is it due back?');
      }
      if (!days()) return at('qsReturnDate', 'The return has to be after the pickup.');
    }
    if (step === 2 && !$('qsVehicleId').value) {
      return at('qsVehicles', 'Choose the car that is going out.');
    }
    if (step === 3) {
      if (!$('qsName').value.trim()) return at('qsName', "The customer's name is needed.");
      // checkPhone writes its own hint under the field and colours it, so
      // this only has to stop the step.
      if (!checkPhone('qsPhone', true)) return at('qsPhone', '');
      if (!$('qsLicence').value.trim()) {
        return at('qsLicence', 'The driving licence number is needed.');
      }
    }
    if (step === 4 && $('qsOdometer').value === '') {
      return at('qsOdometer', 'The reading on the meter as it leaves.');
    }
    if (step === 5 && !(Number($('qsRental').value) > 0)) {
      return at('qsRental', 'What was agreed for the hire.');
    }
    if (step === 6) {
      const shots = $('qsPhotos').files.length + $('qsIdPhoto').files.length;
      if ($('qsPhotos').files.length < 4) {
        return at('qsPhotos', 'At least four photographs of the car, please.');
      }
      if (shots > 12) {
        return at('qsPhotos',
          `That is ${shots} photographs with the licence; twelve is the most that can be kept.`);
      }
      if (!$('qsAck').checked) {
        return at('qsAck', 'The customer has to agree with what is recorded.');
      }
    }
    return null;
  }

  /** Puts the complaint on its field and takes the driver to it. */
  function blame(problem) {
    clearFieldErrors(pane(step));
    const control = $(problem.id);
    if (problem.message) fieldError(control, problem.message);
    else control.classList.add('is-wrong');
    control.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // Not focused: on a phone that opens the keyboard over the message just
    // written. The red and the scroll are the signal.
  }

  function summarise() {
    const d = days();
    const rental = Number($('qsRental').value) || 0;
    const advance = Number($('qsAdvance').value) || 0;
    // Its own class, not the confirmation sheet's .pc-line: that one is sized
    // in points and coloured from variables declared inside the print sheet,
    // so on screen it would come out unruled and uncoloured.
    const line = (k, v) => `<div class="qs-line"><span>${k}</span><span>${v}</span></div>`;
    // The same row, marked as a gap. This screen exists to be read once before
    // the car leaves, and a missing licence photograph in the same calm bold
    // as everything else is exactly the thing that gets read past.
    const gap = (k, v) =>
      `<div class="qs-line qs-line-gap"><span>${k}</span><span>${v}</span></div>`;
    $('qsSummary').innerHTML = [
      line('Customer', escapeHTML($('qsName').value)),
      line('Phone', escapeHTML($('qsPhoneCode').value + ' ' + $('qsPhone').value)),
      line('Car', escapeHTML(chosen ? `${chosen.name} · ${chosen.reg_number || ''}` : '')),
      line('Out', formatDateTime(dt($('qsStartDate').value, $('qsStartTime').value))),
      line('Back', formatDateTime(dt($('qsReturnDate').value, $('qsReturnTime').value))),
      line('Days', String(d)),
      line('Odometer', `${$('qsOdometer').value} km`),
      line('Rental', formatINR(rental)),
      line('Taken now', formatINR(advance)),
      line('Still to pay', formatINR(rental - advance)),
      // Whether it was actually collected, not just what the car's rate card
      // asks for: the two come apart every time a customer says they will pay
      // the deposit later, and only one of them is money in hand.
      (Number($('qsDeposit').value) > 0 && !$('qsDepositTaken').checked
        ? gap('Deposit', formatINR(Number($('qsDeposit').value)) + ' — not taken')
        : line('Deposit', Number($('qsDeposit').value) > 0
            ? formatINR(Number($('qsDeposit').value)) + ' taken'
            : 'None')),
      line('Photographs', String($('qsPhotos').files.length)),
      // Its own row rather than folded into the count above. The licence
      // photograph is the one the office cannot retake later, and a driver
      // reading "6 photographs" cannot tell whether it is among them.
      ($('qsIdPhoto').files.length
        ? line('Licence photo', 'Taken')
        : gap('Licence photo', 'Not taken')),
    ].join('');
  }

  $('qsNext')?.addEventListener('click', async () => {
    const problem = stepFault();
    if (problem) { blame(problem); return; }
    if (step === 1) await loadVehicles();
    if (step === 6) summarise();
    showStep(step + 1);
  });

  $('qsBack')?.addEventListener('click', () => showStep(Math.max(1, step - 1)));

  function closeQuickStart() {
    overlay.hidden = true;
  }
  $('qsCancel')?.addEventListener('click', async () => {
    if ($('qsName').value.trim() || $('qsVehicleId').value) {
      const sure = await nsDialog.confirm(
        'Throw away this walk-in? Nothing has been saved yet.',
        { title: 'Leave Quick Start', confirmLabel: 'Throw it away', tone: 'danger' });
      if (!sure) return;
    }
    closeQuickStart();
  });

  $('drvQuickStart')?.addEventListener('click', () => {
    form.reset();
    vehicles = []; chosen = null;
    $('qsVehicles').innerHTML = '';
    $('qsPhotoCount').textContent = '';
    $('qsBalance').textContent = '';
    // Now, rounded down to the minute, and back tomorrow at the same time:
    // the commonest walk-in is one day, and a driver can change it.
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const iso = (x) => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
    const hhmm = (x) => `${pad(x.getHours())}:${pad(x.getMinutes())}`;
    const tomorrow = new Date(now.getTime() + 86400000);
    $('qsStartDate').value = iso(now);
    $('qsStartTime').value = hhmm(now);
    $('qsReturnDate').value = iso(tomorrow);
    $('qsReturnTime').value = hhmm(tomorrow);
    updateDuration();
    showStep(1);
    overlay.hidden = false;
  });

  /**
   * Photographs go up against the booking, which has to exist first.
   *
   * One request per kind, not per file: the endpoint takes a whole batch and
   * caps each kind at twelve, so twelve files in twelve requests would be
   * twelve chances for a phone on a weak signal to lose one.
   */
  async function upload(bookingId, kind, files) {
    if (!files.length) return true;
    try {
      await api.bookingFiles.add(bookingId, kind, files);
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  }

  $('qsGo')?.addEventListener('click', async () => {
    const problem = stepFault();
    if (problem) { blame(problem); return; }

    const go = $('qsGo');
    go.disabled = true;
    go.textContent = 'Starting…';
    try {
      const made = await api.bookings.quickStart({
        customer_name: $('qsName').value.trim(),
        phone: phoneDigits('qsPhone'),
        phone_code: $('qsPhoneCode').value,
        whatsapp: phoneDigits('qsAlt'),
        whatsapp_code: $('qsAltCode').value,
        address: $('qsAddress').value.trim(),
        licence_number: $('qsLicence').value.trim(),
        vehicle_id: Number($('qsVehicleId').value),
        start_at: dt($('qsStartDate').value, $('qsStartTime').value),
        return_at: dt($('qsReturnDate').value, $('qsReturnTime').value),
        pickup_location: $('qsPickupLocation').value.trim(),
        odometer_km: Number($('qsOdometer').value),
        fuel_level: $('qsFuel').value,
        km_limit_per_day: Number($('qsKmLimit').value) || 0,
        extra_km_rate: Number($('qsExtraKm').value) || 0,
        base_rental: Number($('qsRental').value) || 0,
        advance: Number($('qsAdvance').value) || 0,
        deposit_required: Number($('qsDeposit').value) || 0,
        deposit_taken: $('qsDepositTaken').checked,
        method: $('qsMethod').value,
        condition_note: $('qsDamage').value.trim(),
        notes: $('qsNotes').value.trim(),
      });

      // The rental is recorded whatever happens to the photographs now: the
      // car is out, and a failed upload must not undo that. Anything that
      // does not go up is reported, not swallowed.
      go.textContent = 'Saving photographs…';
      const kept = [
        await upload(made.id, 'pickup', [...$('qsPhotos').files, ...$('qsIdPhoto').files]),
        await upload(made.id, 'payment', [...$('qsPayProof').files]),
      ].every(Boolean);

      closeQuickStart();
      await nsDialog.tell(
        `${made.booking_number} started. ${made.vehicle} (${made.reg || 'no reg. no.'}) is on rental.`
        + (kept ? '' : ' Some photographs did not save — add them from the booking.'),
        { title: 'The car is out' });
      await window.renderDriverPanel();
    } catch (err) {
      // 422s name the fields they are about. Those go on the fields; what
      // cannot be placed -- "that car is already booked" belongs to no box --
      // stays in the band at the bottom.
      const placed = err && err.fields
        ? applyFieldErrors(err.fields, form) : { first: null, stray: [] };
      if (placed.first) {
        placed.first.scrollIntoView({ block: 'center', behavior: 'smooth' });
        fault(placed.stray.join(' '));
      } else {
        fault(typeof err === 'string' ? err : (err?.message || 'Could not start the rental.'));
      }
    } finally {
      go.disabled = false;
      go.textContent = 'Start Rental';
    }
  });
})();
