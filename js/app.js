/* =============================================
   KHEBRA TECH — App Logic
   Scroll reveal, mobile menu, smooth scrolling
   ============================================= */

(function () {
  'use strict';

  /* ── 1. Scroll Reveal (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ── 2. Header Scroll Effect ───────────────── */
  const header = document.getElementById('siteHeader');

  if (header) {
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function () {
      lastScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(function () {
          header.classList.toggle('scrolled', lastScroll > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 3. Mobile Menu ────────────────────────── */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('mainNav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuBtn.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    /* Close menu on nav link click */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu on outside click */
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 4. Smooth Scroll for Anchor Links ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── 5. Hide Scroll Hint on scroll ─────────── */
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    let hintHidden = false;
    window.addEventListener('scroll', function () {
      if (!hintHidden && window.scrollY > 100) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.5s ease';
        hintHidden = true;
      }
    }, { passive: true });
  }

})();
