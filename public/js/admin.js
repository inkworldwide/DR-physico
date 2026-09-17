// Physico Edvance — admin panel JS
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('peSidebar');
  if (sidebar) {
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebar.classList.toggle('show');
      });

      document.addEventListener('click', function (e) {
        if (window.innerWidth <= 991.98 && sidebar.classList.contains('show')) {
          if (!sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
            sidebar.classList.remove('show');
          }
        }
      });
    }

    // Restore saved scroll position or bring active link into view
    try {
      const savedScroll = sessionStorage.getItem('pe_admin_sidebar_scroll');
      if (savedScroll !== null) {
        sidebar.scrollTop = parseInt(savedScroll, 10) || 0;
      } else {
        const activeLink = sidebar.querySelector('.pe-menu-link.active');
        if (activeLink) {
          activeLink.scrollIntoView({ block: 'nearest' });
        }
      }
    } catch(e) {}

    // Save scroll on user scrolling
    let scrollDebounce;
    sidebar.addEventListener('scroll', function () {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(function () {
        try {
          sessionStorage.setItem('pe_admin_sidebar_scroll', sidebar.scrollTop);
        } catch(e) {}
      }, 60);
    }, { passive: true });

    // Save immediately on clicking any menu link
    sidebar.addEventListener('click', function (e) {
      const link = e.target.closest('.pe-menu-link');
      if (link) {
        try {
          sessionStorage.setItem('pe_admin_sidebar_scroll', sidebar.scrollTop);
        } catch(e) {}
      }
    });
  }

  document.querySelectorAll('.alert').forEach(function (alert) {
    setTimeout(function () {
      try {
        if (window.bootstrap && bootstrap.Alert) {
          const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
          if (bsAlert) bsAlert.close();
        } else {
          alert.remove();
        }
      } catch (e) {
        alert.remove();
      }
    }, 5000);
  });

  // Move all modals directly into document.body to avoid parent container stacking-context & overflow trapping
  document.querySelectorAll('.modal').forEach(function (modalEl) {
    if (modalEl.parentElement && modalEl.parentElement !== document.body) {
      document.body.appendChild(modalEl);
    }
  });

  // Robust universal handler for modal open triggers
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-bs-toggle="modal"]');
    if (!trigger) return;
    const targetSelector = trigger.getAttribute('data-bs-target') || trigger.getAttribute('href');
    if (!targetSelector || !targetSelector.startsWith('#')) return;
    const targetModal = document.querySelector(targetSelector);
    if (!targetModal) return;

    e.preventDefault();
    if (window.bootstrap && typeof bootstrap.Modal !== 'undefined') {
      try {
        const inst = bootstrap.Modal.getOrCreateInstance(targetModal);
        inst.show();
      } catch (err) {
        console.warn('Bootstrap modal instance fallback:', err);
      }
    } else {
      // Pure JS fallback when Bootstrap bundle is loading or unavailable
      targetModal.classList.add('show');
      targetModal.style.display = 'block';
      targetModal.removeAttribute('aria-hidden');
      targetModal.setAttribute('aria-modal', 'true');
      if (!document.querySelector('.modal-backdrop')) {
        const bd = document.createElement('div');
        bd.className = 'modal-backdrop fade show';
        document.body.appendChild(bd);
      }
      document.body.classList.add('modal-open');
    }
  });

  // Universal handler for modal dismiss buttons (Close / Cancel / X)
  document.addEventListener('click', function (e) {
    const dismissBtn = e.target.closest('[data-bs-dismiss="modal"]');
    if (!dismissBtn) return;
    const modalEl = dismissBtn.closest('.modal') || document.querySelector('.modal.show');
    if (!modalEl) return;

    if (window.bootstrap && typeof bootstrap.Modal !== 'undefined') {
      try {
        const inst = bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
      } catch (err) {}
    }
    modalEl.classList.remove('show');
    modalEl.style.display = 'none';
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.removeAttribute('aria-modal');
    document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.remove(); });
    document.body.classList.remove('modal-open');
  });

  // Backdrop click dismissal
  window.addEventListener('click', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('modal') && e.target.classList.contains('show')) {
      const modalEl = e.target;
      if (window.bootstrap && typeof bootstrap.Modal !== 'undefined') {
        try {
          const inst = bootstrap.Modal.getInstance(modalEl);
          if (inst) inst.hide();
        } catch (err) {}
      }
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      modalEl.setAttribute('aria-hidden', 'true');
      modalEl.removeAttribute('aria-modal');
      document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.remove(); });
      document.body.classList.remove('modal-open');
    }
  });
});

