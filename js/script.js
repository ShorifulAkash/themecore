/* ==========================================================================
   ThemeCore.net — Premium Domain For Sale | script.js
   Modern, Ultra-Premium Interactivity & State Management
   ========================================================================== */

/* --------------------------------------------------------------------------
   SITE CONFIG
   -------------------------------------------------------------------------- */
const SITE_CONFIG = {
  domain: 'ThemeCore.net',
  price: 9999,
  currency: 'USD'
};

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatPrice(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(message, duration = 3000) {
  const toast = $('#site-toast');
  const msgEl = $('#toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* --------------------------------------------------------------------------
   1. Dynamic Price Rendering
   -------------------------------------------------------------------------- */
function initPrices() {
  const formatted = formatPrice(SITE_CONFIG.price, SITE_CONFIG.currency);
  $$('[data-price]').forEach(el => { el.textContent = formatted; });
  $$('[data-domain]').forEach(el => { el.textContent = SITE_CONFIG.domain; });
}

/* --------------------------------------------------------------------------
   2. Dark / Light Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = $('#theme-toggle-btn');
  const html = document.documentElement;

  // Check saved or default to dark
  const savedTheme = localStorage.getItem('themecore_theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    html.setAttribute('data-theme', savedTheme);
  } else {
    // Default to sleek dark mode
    html.setAttribute('data-theme', 'dark');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('themecore_theme', next);
      showToast(`Switched to ${next} mode`, 2000);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeader() {
  const headerWrapper = $('.site-header-wrapper') || $('.site-header');
  if (!headerWrapper) return;
  const onScroll = () => headerWrapper.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   4. Mobile Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.nav-mobile');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function close() {
    isOpen = false;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', () => (isOpen ? close() : open()));

  document.addEventListener('click', e => {
    if (isOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      close();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });

  $$('.nav-mobile-links a').forEach(link => {
    link.addEventListener('click', close);
  });

  $('.nav-mobile .btn')?.addEventListener('click', close);
}

/* --------------------------------------------------------------------------
   5. Smooth Scroll for Anchor Links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const headerWrapper = $('.site-header-wrapper');

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;

      e.preventDefault();

      const headerH = headerWrapper?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Copy Domain Button
   -------------------------------------------------------------------------- */
function initCopyDomain() {
  const copyBtn = $('#copy-domain-btn');
  const copyText = $('#copy-btn-text');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const domain = SITE_CONFIG.domain;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(domain);
      } else {
        const temp = document.createElement('textarea');
        temp.value = domain;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }

      if (copyText) copyText.textContent = 'Copied!';
      showToast(`${domain} copied to clipboard!`, 2500);

      setTimeout(() => {
        if (copyText) copyText.textContent = 'Copy Domain';
      }, 2000);
    } catch (err) {
      showToast(`Domain: ${domain}`);
    }
  });
}

/* --------------------------------------------------------------------------
   7. Hero Preview Tabs Showcase
   -------------------------------------------------------------------------- */
function initPreviewTabs() {
  const tabBtns = $$('.preview-tab-btn');
  const panels = $$('.preview-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const activePanel = $(`#tab-${tabId}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   8. Financing Plan Options
   -------------------------------------------------------------------------- */
function initFinancePlans() {
  const planBtns = $$('.finance-plan-btn');
  const noteText = $('#purchase-note-text');
  if (!planBtns.length) return;

  const notes = {
    full: 'One-time purchase · Escrow.com secured · Price negotiable',
    '12mo': '12 monthly payments of $833/mo · Zero interest via Escrow.com',
    '24mo': '24 monthly payments of $417/mo · Zero interest via Escrow.com'
  };

  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      planBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      if (noteText && notes[plan]) {
        noteText.textContent = notes[plan];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Mouse Spotlight Glow on Cards
   -------------------------------------------------------------------------- */
function initMouseSpotlight() {
  $$('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   10. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  // Immediately reveal hero section elements for immediate visual impact
  $$('.hero .reveal').forEach(el => el.classList.add('visible'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '120px 0px 100px 0px' });

  $$('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   11. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const items = $$('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });

    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', 'faq-answer-' + Math.random().toString(36).substr(2, 6));
  });
}

/* --------------------------------------------------------------------------
   12. Modal System
   -------------------------------------------------------------------------- */
let lastFocusedEl = null;

function openModal(overlay) {
  if (!overlay) return;
  lastFocusedEl = document.activeElement;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const focusable = overlay.querySelector('input, textarea, button:not(.modal-close), [tabindex]:not([tabindex="-1"])');
    const closeBtn = overlay.querySelector('.modal-close');
    (focusable || closeBtn)?.focus();
  }, 50);
}

function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  lastFocusedEl?.focus();

  const success = overlay.querySelector('.modal-success');
  const form = overlay.querySelector('form');
  if (success) success.style.display = 'none';
  if (form) {
    form.style.display = '';
    form.reset();
    form.querySelectorAll('.form-input, .form-textarea').forEach(f => f.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(e => e.textContent = '');
  }
}

function trapFocus(overlay, e) {
  if (!overlay.classList.contains('open')) return;
  const focusable = [
    ...overlay.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
  ].filter(el => !el.disabled && el.offsetParent !== null);

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey ? e.target === first : e.target === last) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  }
}

function initModals() {
  const overlays = $$('.modal-overlay');

  overlays.forEach(overlay => {
    const closeBtn = overlay.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(overlay));

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });

    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal(overlay);
      if (e.key === 'Tab') trapFocus(overlay, e);
    });
  });

  $$('[data-modal="offer"]').forEach(btn => {
    btn.addEventListener('click', () => openModal($('#modal-offer')));
  });

  $$('[data-modal="contact"]').forEach(btn => {
    btn.addEventListener('click', () => openModal($('#modal-contact')));
  });

  $$('[data-action="buy"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = $('#purchase');
      if (target) {
        const headerWrapper = $('.site-header-wrapper');
        const headerH = headerWrapper?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. Form Validation
   -------------------------------------------------------------------------- */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(input, msg) {
  input.classList.add('error');
  const errEl = input.parentElement.querySelector('.form-error');
  if (errEl) errEl.textContent = msg;
}

function clearError(input) {
  input.classList.remove('error');
  const errEl = input.parentElement.querySelector('.form-error');
  if (errEl) errEl.textContent = '';
}

function initForms() {
  const offerForm = $('#form-offer');
  if (offerForm) {
    offerForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name = $('#offer-name');
      const email = $('#offer-email');
      const amount = $('#offer-amount');

      [name, email, amount].forEach(clearError);

      if (!name.value.trim()) { setError(name, 'Name is required.'); valid = false; }
      if (!email.value.trim()) { setError(email, 'Email is required.'); valid = false; }
      else if (!validateEmail(email.value.trim())) { setError(email, 'Please enter a valid email address.'); valid = false; }
      if (!amount.value.trim()) { setError(amount, 'Offer amount is required.'); valid = false; }
      else if (isNaN(Number(amount.value)) || Number(amount.value) <= 0) {
        setError(amount, 'Please enter a valid offer amount.'); valid = false;
      }

      if (valid) {
        offerForm.style.display = 'none';
        const success = $('#offer-success');
        if (success) success.style.display = 'block';
        showToast('Offer submitted successfully!');
      }
    });

    offerForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  }

  const contactForm = $('#form-contact');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name = $('#contact-name');
      const email = $('#contact-email');
      const msg = $('#contact-message');

      [name, email, msg].forEach(clearError);

      if (!name.value.trim()) { setError(name, 'Name is required.'); valid = false; }
      if (!email.value.trim()) { setError(email, 'Email is required.'); valid = false; }
      else if (!validateEmail(email.value.trim())) { setError(email, 'Please enter a valid email address.'); valid = false; }
      if (msg && !msg.value.trim()) { setError(msg, 'Message is required.'); valid = false; }

      if (valid) {
        contactForm.style.display = 'none';
        const success = $('#contact-success');
        if (success) success.style.display = 'block';
        showToast('Message sent to seller!');
      }
    });

    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  }
}

/* --------------------------------------------------------------------------
   14. Footer Back to Top
   -------------------------------------------------------------------------- */
function initFooter() {
  const backToTop = $('#footer-back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   15. Init All
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPrices();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initCopyDomain();
  initPreviewTabs();
  initFinancePlans();
  initMouseSpotlight();
  initScrollReveal();
  initFAQ();
  initModals();
  initForms();
  initFooter();
});
