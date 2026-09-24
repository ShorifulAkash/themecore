/* ==========================================================================
   ThemeCore.net — Premium Domain For Sale | script.js
   ========================================================================== */

/* --------------------------------------------------------------------------
   SITE CONFIG
   -------------------------------------------------------------------------- */
const SITE_CONFIG = {
  domain: 'ThemeCore.net',
  price: 1999,
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

/* --------------------------------------------------------------------------
   1. Dynamic price rendering
   -------------------------------------------------------------------------- */
function initPrices() {
  const formatted = formatPrice(SITE_CONFIG.price, SITE_CONFIG.currency);
  $$('[data-price]').forEach(el => { el.textContent = formatted; });
  $$('[data-domain]').forEach(el => { el.textContent = SITE_CONFIG.domain; });
}

/* --------------------------------------------------------------------------
   2. Header scroll effect
   -------------------------------------------------------------------------- */
function initHeader() {
  const headerWrapper = $('.site-header-wrapper') || $('.site-header');
  if (!headerWrapper) return;
  const onScroll = () => headerWrapper.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Mobile menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.nav-mobile');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    isOpen = false;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => isOpen ? close() : open());

  $$('.nav-mobile-links a').forEach(link => {
    link.addEventListener('click', close);
  });
  $('.nav-mobile .btn')?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isOpen) close();
  });
}

/* --------------------------------------------------------------------------
   4. Smooth scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const style = getComputedStyle(document.documentElement);
      const headerH = parseInt(style.getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll reveal (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
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
   7. Modal System
   -------------------------------------------------------------------------- */
let lastFocusedEl = null;

function openModal(overlay) {
  if (!overlay) return;
  lastFocusedEl = document.activeElement;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus first focusable element
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

  // Reset success states
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
    // Close button
    const closeBtn = overlay.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(overlay));

    // Click outside
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });

    // Focus trap
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal(overlay);
      if (e.key === 'Tab') trapFocus(overlay, e);
    });
  });

  // Offer modal triggers
  $$('[data-modal="offer"]').forEach(btn => {
    btn.addEventListener('click', () => openModal($('#modal-offer')));
  });

  // Contact modal triggers
  $$('[data-modal="contact"]').forEach(btn => {
    btn.addEventListener('click', () => openModal($('#modal-contact')));
  });

  // Buy now triggers
  $$('[data-action="buy"]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Scroll to purchase section
      const target = $('#purchase');
      if (target) {
        const s = getComputedStyle(document.documentElement);
        const headerH = parseInt(s.getPropertyValue('--header-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Form Validation
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
  // Offer form
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
      }
    });

    // Live validation clear
    offerForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  }

  // Contact form
  const contactForm = $('#form-contact');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name = $('#contact-name');
      const email = $('#contact-email');

      [name, email].forEach(clearError);

      if (!name.value.trim()) { setError(name, 'Name is required.'); valid = false; }
      if (!email.value.trim()) { setError(email, 'Email is required.'); valid = false; }
      else if (!validateEmail(email.value.trim())) { setError(email, 'Please enter a valid email address.'); valid = false; }

      if (valid) {
        contactForm.style.display = 'none';
        const success = $('#contact-success');
        if (success) success.style.display = 'block';
      }
    });

    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  }
}

/* --------------------------------------------------------------------------
   8b. Footer
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
   9. Init All
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initPrices();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initFAQ();
  initModals();
  initForms();
  initFooter();
});
