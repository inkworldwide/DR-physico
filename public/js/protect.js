/**
 * PhysioEdvance — Content Protection
 * Disables right-click, keyboard shortcuts for copy/print/screenshot,
 * share APIs, video downloading, and drag-and-drop of content.
 */
(function () {
  'use strict';

  // 1. Disable right-click context menu
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showProtectionToast('Right-click is disabled on this site.');
    return false;
  });

  // 2. Disable keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    const key = e.key ? e.key.toLowerCase() : '';
    const ctrl = e.ctrlKey || e.metaKey;

    // Block Ctrl+C, Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
    // Ctrl+A (select all), Ctrl+Shift+I / F12 (devtools), PrintScreen
    if (ctrl && ['c', 'u', 's', 'p', 'a'].includes(key)) {
      e.preventDefault();
      if (key === 'p') showProtectionToast('Printing is disabled on this site.');
      return false;
    }
    // F12 / DevTools
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+Shift+I or Ctrl+Shift+J (DevTools)
    if (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(key)) { e.preventDefault(); return false; }
    // PrintScreen key — show warning (OS handles actual capture, we can only warn)
    if (e.key === 'PrintScreen' || e.key === 'F13') {
      showProtectionToast('Screenshots are not permitted on this site.');
      // Clear clipboard to foil paste (only works in supported browsers)
      navigator.clipboard && navigator.clipboard.writeText('PhysioEdvance: Content protected. Unauthorized reproduction prohibited.').catch(function(){});
      return false;
    }
  });

  // 3. Disable drag-and-drop of images and text
  document.addEventListener('dragstart', function (e) { e.preventDefault(); return false; });
  document.addEventListener('drop', function (e) { e.preventDefault(); return false; });

  // 4. Disable Web Share API (native share button in mobile browsers)
  if (navigator.share) {
    Object.defineProperty(navigator, 'share', {
      value: function () {
        showProtectionToast('Sharing is disabled on this site.');
        return Promise.reject(new Error('Sharing disabled.'));
      },
      writable: false
    });
  }

  // 5. Disable text selection on protected elements
  document.body.classList.add('pe-protected');

  // 6. Block right-click on video elements (no download/open in new tab)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('video').forEach(function (v) {
      v.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
      v.setAttribute('disablePictureInPicture', '');
      v.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
    });
    // Observe future video elements (dynamically added)
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeName === 'VIDEO') {
            node.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
            node.setAttribute('disablePictureInPicture', '');
            node.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });

    // 7. Remove any native share buttons injected by browser UI
    var shareBtns = document.querySelectorAll('[data-share],[data-action="share"],[aria-label*="share" i],[title*="share" i]');
    shareBtns.forEach(function (b) { b.remove(); });
  });

  // Helper: show a non-blocking toast warning
  function showProtectionToast(msg) {
    var existing = document.getElementById('pe-protect-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'pe-protect-toast';
    toast.textContent = '🔒 ' + msg;
    toast.style.cssText = [
      'position:fixed', 'bottom:1.5rem', 'left:50%', 'transform:translateX(-50%)',
      'background:#1c1d1f', 'color:#fff', 'padding:0.65rem 1.4rem',
      'border-radius:100px', 'font-size:0.875rem', 'font-weight:600',
      'z-index:999999', 'box-shadow:0 4px 20px rgba(0,0,0,.25)',
      'pointer-events:none', 'opacity:0', 'transition:opacity .2s'
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.style.opacity = '1'; });
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  }

})();
