/**
 * NexcoinPR — Main JavaScript
 * main.js | Vanilla JS — no dependencies
 */

(function () {
  'use strict';

  /* ===========================================================================
     1. HEADER SCROLL BEHAVIOUR
     Adds .scrolled class when page is scrolled past threshold.
     Adds .solid class on pages where header starts opaque (non-homepage).
     =========================================================================== */

  const siteHeader = document.getElementById('site-header');

  function initHeaderScroll() {
    if (!siteHeader) return;

    // On non-homepage pages always start with solid header
    const isHomepage = document.body.classList.contains('page-home');
    if (!isHomepage) {
      siteHeader.classList.add('solid');
    }

    function onScroll() {
      if (window.scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  /* ===========================================================================
     2. MOBILE MENU TOGGLE
     =========================================================================== */

  const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
  let mobileNav        = null;
  let mobileOverlay    = null;

  function buildMobileNav() {
    // Create overlay
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-nav-overlay';
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mobileOverlay);

    // Create nav panel
    mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.setAttribute('role', 'navigation');

    const links = [
      { href: '/', label: 'Home' },
      { type: 'section', label: 'Services', children: [
        { href: '/crypto-pr.html',                   label: 'Crypto PR' },
        { href: '/forex-pr.html',                    label: 'Forex PR' },
        { href: '/blockchain-pr.html',               label: 'Blockchain PR' },
        { href: '/web3-pr.html',                     label: 'Web3 PR' },
        { href: '/fintech-pr.html',                  label: 'Fintech PR' },
        { href: '/financial-pr.html',                label: 'Financial PR' },
        { href: '/press-release-distribution.html',  label: 'Press Release Distribution' },
      ]},
      { href: '/press-releases.html', label: 'Press Releases' },
      { type: 'section', label: 'News', children: [
        { href: '/news.html',                   label: 'All News' },
        { href: '/news/crypto.html',            label: 'Crypto' },
        { href: '/news/forex.html',             label: 'Forex' },
        { href: '/news/blockchain.html',        label: 'Blockchain' },
        { href: '/news/web3.html',              label: 'Web3' },
        { href: '/news/fintech.html',           label: 'Fintech' },
        { href: '/news/financial-markets.html', label: 'Financial Markets' },
        { href: '/news/guides.html',            label: 'Guides' },
      ]},
      { href: '/pricing.html', label: 'Pricing' },
      { href: '/media.html',   label: 'Media' },
      { href: '/about.html',   label: 'About' },
      { href: '/contact.html', label: 'Contact' },
    ];

    links.forEach(function (item) {
      if (item.type === 'section') {
        const section = document.createElement('div');
        section.className = 'mobile-nav-section';
        const title = document.createElement('div');
        title.className = 'mobile-nav-section-title';
        title.textContent = item.label;
        section.appendChild(title);
        const sub = document.createElement('div');
        sub.className = 'mobile-nav-sub';
        item.children.forEach(function (child) {
          const a = document.createElement('a');
          a.href = child.href;
          a.className = 'mobile-nav-link';
          a.textContent = child.label;
          sub.appendChild(a);
        });
        section.appendChild(sub);
        mobileNav.appendChild(section);
      } else {
        const a = document.createElement('a');
        a.href = item.href;
        a.className = 'mobile-nav-link';
        a.textContent = item.label;
        mobileNav.appendChild(a);
      }
    });

    // CTA
    const cta = document.createElement('a');
    cta.href = '/press-release-distribution.html';
    cta.className = 'btn-primary mobile-nav-link';
    cta.style.marginTop = '1.5rem';
    cta.textContent = 'Submit Press Release';
    mobileNav.appendChild(cta);

    document.body.appendChild(mobileNav);
  }

  function openMobileMenu() {
    if (!mobileNav) buildMobileNav();
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    mobileMenuBtn.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    mobileMenuBtn.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    if (!mobileMenuBtn) return;

    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileMenuBtn.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* ===========================================================================
     3. DROPDOWN MENUS (Keyboard Accessible)
     =========================================================================== */

  function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(function (item) {
      const btn     = item.querySelector('.nav-dropdown-btn');
      const menu    = item.querySelector('.dropdown-menu');
      if (!btn || !menu) return;

      let closeTimer = null;

      function openDropdown() {
        clearTimeout(closeTimer);
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }

      function closeDropdown() {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }

      function scheduleClose() {
        closeTimer = setTimeout(closeDropdown, 150);
      }

      // Hover
      item.addEventListener('mouseenter', openDropdown);
      item.addEventListener('mouseleave', scheduleClose);
      menu.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
      menu.addEventListener('mouseleave', scheduleClose);

      // Click / keyboard
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        // Close all others
        dropdownItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.nav-dropdown-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      // Keyboard navigation within dropdown
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
        if (e.key === 'Escape') {
          closeDropdown();
          btn.focus();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openDropdown();
          const firstLink = menu.querySelector('.dropdown-link');
          if (firstLink) firstLink.focus();
        }
      });

      const dropLinks = menu.querySelectorAll('.dropdown-link');
      dropLinks.forEach(function (link, idx) {
        link.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = dropLinks[idx + 1];
            if (next) next.focus();
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (idx === 0) {
              closeDropdown();
              btn.focus();
            } else {
              const prev = dropLinks[idx - 1];
              if (prev) prev.focus();
            }
          }
          if (e.key === 'Escape') {
            closeDropdown();
            btn.focus();
          }
          if (e.key === 'Tab' && idx === dropLinks.length - 1 && !e.shiftKey) {
            closeDropdown();
          }
        });
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function (e) {
      dropdownItems.forEach(function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove('open');
          const btn = item.querySelector('.nav-dropdown-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ===========================================================================
     4. FAQ ACCORDION
     Smooth height animation using max-height trick.
     =========================================================================== */

  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Option: allow multiple open at once — remove the close-others block if desired
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
            const otherQ = other.querySelector('.faq-question');
            const otherA = other.querySelector('.faq-answer');
            if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
            if (otherA) {
              otherA.classList.remove('open');
              otherA.setAttribute('aria-hidden', 'true');
            }
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          answer.classList.remove('open');
          question.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('open');
          answer.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });

      // Keyboard support
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /* ===========================================================================
     5. COOKIE BANNER
     =========================================================================== */

  const COOKIE_KEY = 'nexcoinpr_cookie_consent';

  function initCookieBanner() {
    const banner      = document.getElementById('cookie-banner');
    const acceptBtn   = document.getElementById('cookie-accept');
    const rejectBtn   = document.getElementById('cookie-reject');

    if (!banner) return;

    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Show banner after a short delay
      setTimeout(function () {
        banner.removeAttribute('hidden');
      }, 1200);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        banner.setAttribute('hidden', '');
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        localStorage.setItem(COOKIE_KEY, 'rejected');
        banner.setAttribute('hidden', '');
      });
    }
  }

  /* ===========================================================================
     6. FOOTER YEAR
     =========================================================================== */

  function initFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ===========================================================================
     7. CLIENT-SIDE SEARCH FILTER
     Filters .search-result-item elements based on data-title and data-tags attrs.
     =========================================================================== */

  function initSearch() {
    const searchInput  = document.querySelector('.search-input[data-live-search]');
    const searchTarget = document.getElementById('search-results');

    if (!searchInput || !searchTarget) return;

    const items = searchTarget.querySelectorAll('[data-searchable]');
    const noResultsMsg = document.getElementById('no-results-msg');

    function doSearch(query) {
      const q = query.toLowerCase().trim();
      let visible = 0;

      items.forEach(function (item) {
        const title    = (item.dataset.title   || '').toLowerCase();
        const tags     = (item.dataset.tags    || '').toLowerCase();
        const excerpt  = (item.dataset.excerpt || '').toLowerCase();
        const matches  = !q || title.includes(q) || tags.includes(q) || excerpt.includes(q);

        item.style.display = matches ? '' : 'none';
        if (matches) visible++;
      });

      if (noResultsMsg) {
        noResultsMsg.style.display = visible === 0 && q ? '' : 'none';
      }
    }

    searchInput.addEventListener('input', function () {
      doSearch(searchInput.value);
    });

    // Search on form submit
    const searchForm = searchInput.closest('form');
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        doSearch(searchInput.value);
      });
    }
  }

  /* ===========================================================================
     8. SMOOTH ANCHOR SCROLL
     For same-page # links, accounts for sticky header offset.
     =========================================================================== */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });

      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    });
  }

  /* ===========================================================================
     9. ACTIVE NAV LINK HIGHLIGHTING
     Sets .active class on nav links matching the current page URL.
     =========================================================================== */

  function initActiveNav() {
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const navLinks    = document.querySelectorAll('.nav-link[href], .dropdown-link[href]');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = href.replace(/\/$/, '') || '/';

      if (linkPath === currentPath) {
        link.classList.add('active');
        // Also mark parent dropdown button
        const parentDropdown = link.closest('.nav-item-dropdown');
        if (parentDropdown) {
          const btn = parentDropdown.querySelector('.nav-dropdown-btn');
          if (btn) btn.classList.add('active');
        }
      }
    });
  }

  /* ===========================================================================
     10. MOBILE NAV CLOSE ON OUTSIDE CLICK
     =========================================================================== */

  function initOutsideClickClose() {
    document.addEventListener('click', function (e) {
      if (!mobileNav || !mobileNav.classList.contains('open')) return;
      if (mobileMenuBtn && mobileMenuBtn.contains(e.target)) return;
      if (mobileNav.contains(e.target)) return;
      closeMobileMenu();
    });

    // Also close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
        const openDropdown = document.querySelector('.nav-item-dropdown.open');
        if (openDropdown) {
          openDropdown.classList.remove('open');
          const btn = openDropdown.querySelector('.nav-dropdown-btn');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
          }
        }
      }
    });
  }

  /* ===========================================================================
     BONUS: PRICING TOGGLE (annual/monthly)
     =========================================================================== */

  function initPricingToggle() {
    const toggle = document.querySelector('.pricing-toggle-switch');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      const isOn = toggle.classList.toggle('on');

      const monthlyPrices = document.querySelectorAll('[data-price-monthly]');
      const annualPrices  = document.querySelectorAll('[data-price-annual]');

      monthlyPrices.forEach(function (el) {
        el.style.display = isOn ? 'none' : '';
      });

      annualPrices.forEach(function (el) {
        el.style.display = isOn ? '' : 'none';
      });

      const labels = document.querySelectorAll('.pricing-toggle-label');
      labels.forEach(function (label, i) {
        if (i === 0) label.classList.toggle('active', !isOn);
        if (i === 1) label.classList.toggle('active', isOn);
      });
    });
  }

  /* ===========================================================================
     BONUS: LAZY-LOAD IMAGES (Intersection Observer)
     =========================================================================== */

  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(function (img) { observer.observe(img); });
  }

  /* ===========================================================================
     BONUS: ANNOUNCEMENT BAR DISMISS
     =========================================================================== */

  function initAnnouncementBar() {
    const bar = document.querySelector('.announcement-bar');
    const dismiss = document.querySelector('.announcement-dismiss');
    if (!bar || !dismiss) return;

    const key = 'nexcoinpr_announcement_dismissed';
    if (sessionStorage.getItem(key)) {
      bar.style.display = 'none';
      return;
    }

    dismiss.addEventListener('click', function () {
      bar.style.display = 'none';
      sessionStorage.setItem(key, '1');
    });
  }

  /* ===========================================================================
     BONUS: BACK TO TOP BUTTON
     =========================================================================== */

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.style.opacity  = window.scrollY > 400 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===========================================================================
     BONUS: READ TIME ESTIMATOR
     Calculates and displays estimated read time for article pages.
     =========================================================================== */

  function initReadTime() {
    const articleBody = document.querySelector('.article-body');
    const readTimeEl  = document.querySelector('[data-read-time]');
    if (!articleBody || !readTimeEl) return;

    const text      = articleBody.textContent || '';
    const wordCount = text.trim().split(/\s+/).length;
    const minutes   = Math.max(1, Math.round(wordCount / 230));

    readTimeEl.textContent = minutes + ' min read';
  }

  /* ===========================================================================
     BONUS: NEWSLETTER FORM HANDLING (placeholder — no backend)
     =========================================================================== */

  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const msgEl = form.querySelector('.newsletter-message');

        if (!input || !input.value || !input.value.includes('@')) {
          if (msgEl) {
            msgEl.textContent = 'Please enter a valid email address.';
            msgEl.style.color = 'var(--color-error)';
          }
          return;
        }

        // Simulate success (replace with actual API call)
        if (msgEl) {
          msgEl.textContent = 'Thank you! We\'ll be in touch shortly.';
          msgEl.style.color = 'var(--color-blockchain)';
        }

        input.value = '';
        form.querySelector('[type="submit"]').disabled = true;
      });
    });
  }

  /* ===========================================================================
     BONUS: CONTACT FORM VALIDATION
     =========================================================================== */

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
      form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
        el.classList.remove('error');
      });

      // Validate required fields
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
          const errorEl = field.parentElement.querySelector('.form-error');
          if (errorEl) errorEl.textContent = 'This field is required.';
        }
      });

      // Validate email
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value && !emailField.value.includes('@')) {
        valid = false;
        emailField.classList.add('error');
        const errorEl = emailField.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
      }

      if (!valid) return;

      // Simulate submission
      const submitBtn  = form.querySelector('[type="submit"]');
      const successMsg = document.getElementById('contact-success');

      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending…';
      }

      setTimeout(function () {
        if (successMsg) successMsg.style.display = '';
        form.style.display = 'none';
      }, 800);
    });
  }

  /* ===========================================================================
     INIT — DOM READY
     =========================================================================== */

  function init() {
    initHeaderScroll();
    initMobileMenu();
    initDropdowns();
    initFaqAccordion();
    initCookieBanner();
    initFooterYear();
    initSearch();
    initSmoothScroll();
    initActiveNav();
    initOutsideClickClose();
    initPricingToggle();
    initLazyImages();
    initAnnouncementBar();
    initBackToTop();
    initReadTime();
    initNewsletterForms();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
