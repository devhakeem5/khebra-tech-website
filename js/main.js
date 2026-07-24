/* ========================================
   KHEBRA TECH — Main JS
   All interactions in one clean file
   ======================================== */

(function () {
    'use strict';

    /* ── Header scroll effect ── */
    const header = document.getElementById('header');
    let lastScroll = 0;

    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 50);
        lastScroll = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Mobile menu ── */
    const toggle = document.getElementById('menuToggle');
    const nav    = document.getElementById('nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            nav.classList.toggle('open');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });

        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                nav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── Active nav link ── */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const y = window.scrollY + 100;
        sections.forEach(s => {
            const top = s.offsetTop;
            const h   = s.offsetHeight;
            const id  = s.id;
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', y >= top && y < top + h);
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ── Scroll reveal (Intersection Observer) ── */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealEls.forEach(el => revealObs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ── Counter animation ── */
    const metrics = document.querySelectorAll('.metric-value[data-target]');
    let countersRan = false;

    function animateCounters() {
        if (countersRan) return;
        countersRan = true;

        metrics.forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = eased * target;

                el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = isFloat ? target.toFixed(1) : target;
                }
            }

            requestAnimationFrame(tick);
        });
    }

    if (metrics.length) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateCounters();
            });
        }, { threshold: 0.5 });

        metrics.forEach(m => counterObs.observe(m));
    }

    /* ── Contact form ── */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const orig = btn.innerHTML;

            btn.innerHTML = '<span>جاري الإرسال…</span>';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerHTML = '<span>✓ تم الإرسال بنجاح</span>';
                btn.style.background = '#10B981';
                btn.style.opacity = '1';
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    /* ── Cyber grid random activation ── */
    const gridCells = document.querySelectorAll('.grid-cell');
    if (gridCells.length) {
        setInterval(() => {
            // Deactivate a random active cell
            const activeCells = document.querySelectorAll('.grid-cell.active');
            if (activeCells.length > 0) {
                const randomActive = activeCells[Math.floor(Math.random() * activeCells.length)];
                randomActive.classList.remove('active');
            }
            // Activate a random cell
            const randomCell = gridCells[Math.floor(Math.random() * gridCells.length)];
            randomCell.classList.add('active');
        }, 1500);
    }

})();
