/**
 * Sculpted by Khai — Eyebrow Bar
 * Main JavaScript: Sticky Header, Mobile Menu,
 * Intersection Observer Animations, Smooth Scroll, Back to Top
 */

'use strict';

/* ── DOM REFERENCES ─────────────────────────────── */
const header       = document.getElementById('site-header');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');
const mobileClose  = document.getElementById('mobile-close');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileLinks  = document.querySelectorAll('.mobile-link');
const backToTop    = document.getElementById('back-to-top');
const animEls      = document.querySelectorAll('.animate-on-scroll');


/* ── STICKY HEADER ──────────────────────────────── */
let lastScrollY = 0;
let ticking = false;

function updateHeader() {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
}, { passive: true });

// Run once on load in case page is already scrolled
updateHeader();


/* ── MOBILE MENU ────────────────────────────────── */
function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('visible');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileClose.focus();
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('visible');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus();
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) { closeMenu(); } else { openMenu(); }
});

mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

// Trap focus inside mobile menu when open
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const focusable = mobileMenu.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});


/* ── SMOOTH SCROLL ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const headerOffset = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  });
});


/* ── INTERSECTION OBSERVER — SCROLL ANIMATIONS ── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // animate once
    }
  });
}, observerOptions);

animEls.forEach(el => observer.observe(el));


/* ── BACK TO TOP ────────────────────────────────── */
function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── GALLERY — LIGHTBOX HINT (OPTIONAL) ─────────── */
// Simple scale-up on click for gallery items — placeholder for future lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      item.click();
    }
  });
});


/* ── HEADER ACTIVE NAV LINK ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');

function updateActiveNav() {
  let currentSection = '';
  const scrollY = window.scrollY + header.offsetHeight + 80;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    const href = link.getAttribute('href').replace('#', '');
    if (href === currentSection) {
      link.classList.add('active-nav');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ── ACTIVE NAV LINK STYLE (injected) ──────────── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .desktop-nav a.active-nav:not(.btn) {
    color: var(--primary) !important;
    background: rgba(183,132,167,0.08) !important;
  }
  .site-header:not(.scrolled) .desktop-nav a.active-nav:not(.btn) {
    color: var(--white) !important;
    background: rgba(255,255,255,0.12) !important;
  }
`;
document.head.appendChild(styleSheet);


/* ── LAZY LOAD FALLBACK ─────────────────────────── */
// Native lazy loading is used; this is a polyfill fallback for older browsers
if ('loading' in HTMLImageElement.prototype) {
  // Native support — nothing to do
} else {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}


/* ── PERFORMANCE: REDUCE MOTION SUPPORT ─────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Immediately show all animated elements without animation
  animEls.forEach(el => {
    el.classList.add('in-view');
    el.style.transition = 'none';
  });

  document.querySelectorAll('.marquee-track').forEach(el => {
    el.style.animation = 'none';
  });
}
