/**
 * Photographs: choosing them, and looking at them.
 *
 * The browser's own file control is a grey button and a filename with its
 * middle eaten out -- "NiteSha Co…venture.png". Standing at a car you cannot
 * tell from that whether you photographed the number plate or your shoe, and
 * the only way to find out is to submit and hope.
 *
 * So every file input that takes an image is upgraded in place: a camera
 * button, and the pictures themselves underneath at a size you can actually
 * read. Tap one and it fills the screen.
 *
 * Done by finding the inputs rather than by changing eleven bits of markup,
 * because the next form somebody adds should get this without remembering to
 * ask for it. The native input stays where it was and keeps its id, its name
 * and its files -- everything already reading `.files` carries on working,
 * and a form that posts normally still posts.
 */

(function () {
  'use strict';

  const CAMERA =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.3a1 1 0 0 0 .83-.45l.74-1.1A1 1 0 0 1 9.2 5h5.6a1 1 0 0 1 .83.45l.74 1.1a1 1 0 0 0 .83.45h2.3A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/>' +
    '<circle cx="12" cy="12.5" r="3.4"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---- full view ------------------------------------------------------- */

  let box = null;

  function lightbox(src, caption) {
    if (!box) {
      box = document.createElement('div');
      box.className = 'photo-full';
      box.hidden = true;
      box.innerHTML =
        '<button type="button" class="photo-full-close" aria-label="Close">&times;</button>'
        + '<img alt="">'
        + '<p class="photo-full-cap"></p>';
      document.body.appendChild(box);
      // Anywhere off the picture closes it: on a phone the close button is a
      // small target at the top of a photograph filling the screen.
      box.addEventListener('click', (e) => {
        if (e.target === box || e.target.classList.contains('photo-full-close')) shut();
      });
    }
    box.querySelector('img').src = src;
    box.querySelector('.photo-full-cap').textContent = caption || '';
    box.hidden = false;
    document.body.classList.add('photo-full-open');
    box.querySelector('.photo-full-close').focus();
  }

  function shut() {
    if (!box) return;
    box.hidden = true;
    // Not left loaded behind the overlay: these are photographs off a phone.
    box.querySelector('img').removeAttribute('src');
    document.body.classList.remove('photo-full-open');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box && !box.hidden) shut();
  });

  // Every photograph already on the page -- the ones stored against a booking,
  // a car's picture, a place's -- opens here too rather than in a new tab. A
  // new tab loses the panel on a phone, and coming back reloads it.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.proof-item a, .photo-preview a');
    if (link && link.querySelector('img')) {
      e.preventDefault();
      const img = link.querySelector('img');
      lightbox(link.getAttribute('href') || img.src, img.getAttribute('title') || img.alt);
      return;
    }
    // Bare previews: a place's picture, a vehicle's, and the five attachment
    // boxes in the panel, which append plain <img> rather than a linked one.
    const bare = e.target.closest(
      '.photo-preview img, .car-photo-preview img, .proof-preview img');
    if (bare) lightbox(bare.src, bare.alt);
  });

  /* ---- the inputs ------------------------------------------------------ */

  const takesImages = (input) => {
    const accept = (input.getAttribute('accept') || '').toLowerCase();
    return accept.includes('image') || input.hasAttribute('capture');
  };

  function upgrade(input) {
    if (input.dataset.photoReady) return;
    // The brand slots in Website content already have their own picker, a
    // preview and a cropper; this would be a second button beside the first.
    if (input.classList.contains('brand-slot-file')) return;
    input.dataset.photoReady = '1';

    const many = input.hasAttribute('multiple');
    // Some inputs show the chosen picture their own way -- the vehicle
    // photograph has a cropper. Those take the button and not the strip.
    const wantStrip = input.dataset.photoPreview !== 'off';

    const wrap = document.createElement('div');
    wrap.className = 'photo-input';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'btn btn-outline photo-pick';
    pick.innerHTML = CAMERA + '<span>' + (many ? 'Add photos' : 'Add photo') + '</span>';
    // The input is labelled; the button is what is actually pressed, so the
    // label's words have to reach it or it is announced as "Add photo" with
    // no idea which photo.
    const label = input.id && document.querySelector('label[for="' + input.id + '"]');
    if (label) pick.setAttribute('aria-label', label.textContent.trim() + ': add photo');
    pick.addEventListener('click', () => input.click());
    wrap.appendChild(pick);

    // Adding never replaces, so there has to be a cheap way back: without
    // this, twelve photographs picked by mistake cost twelve taps to undo.
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'photo-clear';
    clear.textContent = 'Remove all';
    clear.hidden = true;
    if (many) wrap.appendChild(clear);

    const strip = document.createElement('div');
    strip.className = 'photo-strip';
    if (wantStrip) wrap.appendChild(strip);

    let urls = [];
    const letGo = () => { urls.forEach(URL.revokeObjectURL); urls = []; };

    const say = (n) => {
      pick.querySelector('span').textContent = n
        ? (many ? 'Add more' : 'Change photo')
        : (many ? 'Add photos' : 'Add photo');
    };

    function draw() {
      letGo();
      const files = [...(input.files || [])];
      say(files.length);
      if (many) clear.hidden = files.length < 2;
      if (!wantStrip) return;

      strip.innerHTML = files.map((file, i) => {
        // A PDF or anything else that is not a picture cannot be shown, so it
        // is named instead of being drawn as a broken image.
        if (!file.type.startsWith('image/')) {
          return '<span class="photo-chip"><span class="photo-chip-name">'
            + esc(file.name) + '</span>'
            + '<button type="button" class="photo-drop" data-i="' + i
            + '" aria-label="Remove ' + esc(file.name) + '">&times;</button></span>';
        }
        const url = URL.createObjectURL(file);
        urls.push(url);
        return '<span class="photo-chip">'
          + '<img src="' + url + '" alt="' + esc(file.name) + '" title="' + esc(file.name) + '">'
          + '<button type="button" class="photo-drop" data-i="' + i
          + '" aria-label="Remove ' + esc(file.name) + '">&times;</button></span>';
      }).join('');

    }

    strip.addEventListener('click', (e) => {
      const drop = e.target.closest('.photo-drop');
      if (drop) {
        // Rebuilt rather than spliced: a FileList is read-only, and this is
        // the only way to hand the input a shorter one that still posts.
        const keep = new DataTransfer();
        [...input.files].forEach((f, i) => { if (i !== Number(drop.dataset.i)) keep.items.add(f); });
        input.files = keep.files;
        // Recorded before the event goes out, or the merge below would read
        // the longer list as "what was there" and put the file straight back.
        kept = [...keep.files];
        // So that anything else listening -- a count, a cropper -- hears it.
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      const img = e.target.closest('.photo-chip img');
      if (img) lightbox(img.src, img.alt);
    });

    /*
     * "Add more" has to mean add.
     *
     * A file input replaces its whole selection every time the picker is
     * used, and with capture on a phone the picker takes exactly one
     * photograph. So a driver told to photograph four sides, tapping four
     * times, ends up with the fourth and no warning that the other three
     * went. Here the earlier files are put back in front of the new ones.
     *
     * Only for multiple inputs: on a single one, choosing again is meant to
     * replace what is there.
     */
    let kept = [];
    let merging = false;

    input.addEventListener('change', () => {
      if (merging) { kept = [...(input.files || [])]; draw(); return; }

      const now = [...(input.files || [])];
      if (many && kept.length && now.length) {
        // Same name, size and timestamp is the same photograph -- taking one
        // twice is a mis-tap, not two pictures of the wheel.
        const sig = (f) => f.name + '|' + f.size + '|' + f.lastModified;
        const seen = new Set(kept.map(sig));
        const merged = kept.concat(now.filter((f) => !seen.has(sig(f))));
        if (merged.length !== now.length) {
          const all = new DataTransfer();
          merged.forEach((f) => all.items.add(f));
          input.files = all.files;
          kept = merged;
          // Setting .files fires nothing, and the other listeners on this
          // input -- the attachment previews, the photograph count -- have
          // already seen the short list. Send it again with the real one.
          merging = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          merging = false;
          return;
        }
      }
      kept = now;
      draw();
    });

    // form.reset() empties the input without telling anyone, which would
    // otherwise leave the previous customer's photographs on screen.
    clear.addEventListener('click', () => {
      input.value = '';
      kept = [];
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    input.form && input.form.addEventListener('reset',
      () => setTimeout(() => { kept = []; draw(); }, 0));
    draw();
  }

  function sweep(root) {
    (root || document).querySelectorAll('input[type="file"]').forEach((input) => {
      if (takesImages(input)) upgrade(input);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sweep());
  } else {
    sweep();
  }
  // Forms drawn after load -- a booking's attachment boxes are rendered from
  // JavaScript -- are picked up when they appear.
  new MutationObserver((changes) => {
    for (const change of changes) {
      for (const node of change.addedNodes) {
        if (node.nodeType === 1) sweep(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.photoFullView = lightbox;
})();
