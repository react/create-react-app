/**
 * Which fields are compulsory, and which one is wrong.
 *
 * Two things that were missing everywhere. A form gave no sign which fields
 * it insisted on until it refused, and when it refused it said so in a box
 * at the bottom -- so on a long form, or a wizard step scrolled down, the
 * complaint and the field it is about were nowhere near each other. You read
 * "At least four photographs of the car, please" and then went looking.
 *
 * So: a red star on every compulsory field, taken from the `required`
 * attribute the markup already carries, and errors put against the field
 * they belong to.
 *
 * Done by finding the fields rather than by editing a hundred and seventy
 * labels, so a form added next week gets both without asking.
 */

(function () {
  'use strict';

  function star(label) {
    if (label.querySelector('.req-star')) return;
    const s = document.createElement('span');
    s.className = 'req-star';
    s.textContent = '*';
    // The control's own `required` is what a screen reader announces. The
    // star is for the eye; read out as well it becomes "star" after every
    // compulsory field.
    s.setAttribute('aria-hidden', 'true');

    // A label laid out as a row -- a checkbox and its sentence -- makes the
    // star a third item in that row, which on a sentence long enough to wrap
    // leaves it stranded on its own at the far end. Inside the words instead.
    const display = getComputedStyle(label).display;
    if (display === 'flex' || display === 'inline-flex' || display === 'grid') {
      const words = [...label.childNodes].reverse()
        .find((n) => n.nodeType === 3 && n.textContent.trim() !== '');
      if (words) {
        const holder = document.createElement('span');
        words.replaceWith(holder);
        holder.appendChild(words);
        holder.appendChild(s);
        return;
      }
    }
    label.appendChild(s);
  }

  function labelFor(control) {
    if (control.id) {
      const found = document.querySelector('label[for="' + CSS.escape(control.id) + '"]');
      if (found) return found;
    }
    // A checkbox written inside its own label has no `for` to find it by.
    return control.closest('label');
  }

  function markRequired(root) {
    (root || document).querySelectorAll('[required]').forEach((control) => {
      if (control.type === 'hidden' || control.dataset.reqStar) return;
      control.dataset.reqStar = '1';
      const label = labelFor(control);
      if (label) star(label);
    });
  }

  /* ---- the message, where the field is -------------------------------- */

  /**
   * Where an error for this control should be written.
   *
   * Immediately under the control, not at the end of its group: appended to
   * the group it ends up below the hint and whatever else the field carries,
   * which on the photographs step put the complaint two lines and a count
   * away from the thing it was complaining about.
   */
  function anchor(control) {
    // The widgets that wrap their control: the message goes under the whole
    // widget, not between its halves.
    const unit = control.closest('.photo-input, .phone-field') || control;
    if (unit.parentNode) return { parent: unit.parentNode, before: unit.nextSibling };
    const label = control.closest('label');
    if (label && label.parentNode) return { parent: label.parentNode, before: label.nextSibling };
    return { parent: control.parentNode, before: control.nextSibling };
  }

  /**
   * Its own note, found by the control it belongs to.
   *
   * Keyed rather than "the .field-error next to me": two fields can share a
   * parent -- a two-column row, a wizard step -- and the first would then
   * have its message overwritten by the second.
   */
  const keyOf = (control) => control.id || control.name || '';

  function noteFor(control, make) {
    const key = keyOf(control);
    const where = anchor(control);
    const scope = control.closest('.field-group') || where.parent;
    let note = scope.querySelector('.field-error[data-for="' + CSS.escape(key) + '"]');
    if (!note && make) {
      note = document.createElement('p');
      note.className = 'field-hint is-wrong field-error';
      note.setAttribute('role', 'alert');
      note.dataset.for = key;
      where.parent.insertBefore(note, where.before);
    }
    return note;
  }

  /**
   * Put a complaint against one field, in red, where the field is.
   *
   * Returns the control, so a caller can scroll to it: a message beside a
   * field two screens down is the problem this is meant to solve, not a
   * smaller version of it.
   */
  function fieldError(control, message) {
    if (typeof control === 'string') control = document.getElementById(control);
    if (!control) return null;

    control.classList.add('is-wrong');
    control.setAttribute('aria-invalid', 'true');
    // The phone widget colours its two halves together.
    const phone = control.closest('.phone-field');
    if (phone) phone.classList.add('is-wrong');

    noteFor(control, true).textContent = message;
    return control;
  }

  /** Clears every complaint inside a step, a modal or a form. */
  function clearFieldErrors(root) {
    const scope = root || document;
    scope.querySelectorAll('.field-error').forEach((n) => n.remove());
    scope.querySelectorAll('.is-wrong').forEach((n) => {
      n.classList.remove('is-wrong');
      n.removeAttribute('aria-invalid');
    });
  }

  // Typing is the answer to "this is wrong"; the red should go the moment it
  // is being dealt with, not when the form is submitted again.
  const settle = (e) => {
    const control = e.target;
    if (!control.classList || !control.classList.contains('is-wrong')) return;
    control.classList.remove('is-wrong');
    control.removeAttribute('aria-invalid');
    const phone = control.closest('.phone-field');
    if (phone) phone.classList.remove('is-wrong');
    const note = noteFor(control, false);
    if (note) note.remove();
  };
  document.addEventListener('input', settle, true);
  document.addEventListener('change', settle, true);

  /**
   * Server-side refusals, put on the fields they name.
   *
   * The endpoints answer a bad save with 422 and {fields: {name: why}}, and
   * until now every one of those was flattened into a dialog. A form opts in
   * by naming its inputs: data-field="odometer_km" on the input that holds
   * it. Returns what it could not place, so the caller can still say it.
   */
  function applyFieldErrors(fields, root) {
    const scope = root || document;
    const stray = [];
    let first = null;
    for (const [name, why] of Object.entries(fields || {})) {
      const control = scope.querySelector('[data-field="' + CSS.escape(name) + '"]');
      if (control) {
        const marked = fieldError(control, why);
        if (!first) first = marked;
      } else {
        stray.push(why);
      }
    }
    return { first, stray };
  }

  markRequired();
  new MutationObserver((changes) => {
    for (const change of changes) {
      for (const node of change.addedNodes) if (node.nodeType === 1) markRequired(node);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.fieldError = fieldError;
  window.clearFieldErrors = clearFieldErrors;
  window.applyFieldErrors = applyFieldErrors;
  window.markRequired = markRequired;
})();
