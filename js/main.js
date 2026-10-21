/* ==========================================================================
   VENICE TILE & MARBLE — MAIN UI CONTROLLER
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Dark Luxury Atelier vs Light Alabaster Showroom)
    const savedTheme = localStorage.getItem('venice_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeBtn = document.getElementById('theme-toggle-btn');
    function updateThemeIcon(theme) {
      if (!themeBtn) return;
      themeBtn.innerHTML = theme === 'dark' ? '☀' : '☾';
      themeBtn.title = theme === 'dark' ? 'Switch to Light Alabaster Mode' : 'Switch to Dark Atelier Mode';
    }
    updateThemeIcon(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('venice_theme', next);
        updateThemeIcon(next);
      });
    }

    // 2. Mobile Navigation Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    if (mobileBtn && mainNav) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
        mobileBtn.innerHTML = isOpen ? '✕' : '☰';
      });
    }

    // 3. Initialize Page-Specific Sliders
    const pageType = document.body.dataset.page;
    if (pageType === 'home' && typeof window.initHomeSliders === 'function') {
      window.initHomeSliders();
    } else if (
      ['rare-precious-stone', 'bathroom', 'indoor', 'outdoor', 'kitchen'].includes(pageType) &&
      typeof window.initGalleryPageSlider === 'function'
    ) {
      window.initGalleryPageSlider(pageType);
    }

    // 4. Interactive Contact / Consultation Form
    const quoteForm = document.getElementById('consultation-form');
    const formFeedback = document.getElementById('form-feedback');
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cf-name')?.value.trim() || '';
        const phone = document.getElementById('cf-phone')?.value.trim() || '';
        const email = document.getElementById('cf-email')?.value.trim() || '';
        const category = document.getElementById('cf-category')?.value || 'General Stonework';
        const material = document.getElementById('cf-material')?.value || 'Undecided';
        const details = document.getElementById('cf-message')?.value.trim() || '';

        const subject = encodeURIComponent(`Project Inquiry: ${category} — ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nProject Scope: ${category}\nPreferred Material: ${material}\n\nProject Details:\n${details}`
        );

        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = `
            <strong>Thank you, ${name || 'valued client'}!</strong> Your consultation inquiry is ready.
            We have opened your email client addressed to <strong>VeniceTile111@gmail.com</strong>.
            For the fastest response, call us directly at <a href="tel:4086908510" style="color:var(--accent-gold);text-decoration:underline;font-weight:700;">(408) 690-8510</a>.
          `;
        }

        window.location.href = `mailto:VeniceTile111@gmail.com?subject=${subject}&body=${body}`;
      });
    }
  });
})();
