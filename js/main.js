/* ========================================
   KHEBRA TECH — Main JS v2
   Particles · Tilt · Reveal · Terminal
   ======================================== */

(function () {
    'use strict';

    /* ═══════════════════════════════════════
       1. PARTICLE NETWORK (Canvas)
       ═══════════════════════════════════════ */

    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };
        let animFrame;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction — push particles away
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += dx * force * 0.03;
                        this.y += dy * force * 0.03;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        const opacity = (1 - dist / 140) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            animFrame = requestAnimationFrame(animateParticles);
        }

        // Events
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();
    }


    /* ═══════════════════════════════════════
       2. HEADER SCROLL
       ═══════════════════════════════════════ */

    const header = document.getElementById('header');

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    /* ═══════════════════════════════════════
       3. MOBILE MENU
       ═══════════════════════════════════════ */

    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

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


    /* ═══════════════════════════════════════
       4. ACTIVE NAV LINK
       ═══════════════════════════════════════ */

    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const y = window.scrollY + 120;
        sections.forEach(s => {
            const top = s.offsetTop;
            const h = s.offsetHeight;
            const id = s.id;
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', y >= top && y < top + h);
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });


    /* ═══════════════════════════════════════
       5. SMOOTH SCROLL
       ═══════════════════════════════════════ */

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* ═══════════════════════════════════════
       6. SCROLL REVEAL (Intersection Observer)
       ═══════════════════════════════════════ */

    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const revealEls = document.querySelectorAll(revealSelectors);

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }


    /* ═══════════════════════════════════════
       7. COUNTER ANIMATION
       ═══════════════════════════════════════ */

    const counters = document.querySelectorAll('.counter[data-target]');
    let countersRan = false;

    function animateCounters() {
        if (countersRan) return;
        countersRan = true;

        counters.forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isFloat = target % 1 !== 0;
            const duration = 2500;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
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

    if (counters.length) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateCounters();
            });
        }, { threshold: 0.3 });

        counters.forEach(m => counterObs.observe(m));
    }


    /* ═══════════════════════════════════════
       8. TERMINAL TYPING EFFECT
       ═══════════════════════════════════════ */

    const terminalBody = document.getElementById('terminalBody');
    let terminalStarted = false;

    function startTerminal() {
        if (terminalStarted || !terminalBody) return;
        terminalStarted = true;

        const lines = terminalBody.querySelectorAll('.terminal-line');
        lines.forEach(line => {
            const delay = parseInt(line.dataset.delay) || 0;
            setTimeout(() => {
                line.classList.add('visible');
            }, delay);
        });
    }

    if (terminalBody) {
        const termObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) startTerminal();
            });
        }, { threshold: 0.4 });

        termObs.observe(terminalBody);
    }


    /* ═══════════════════════════════════════
       9. 3D TILT EFFECT (Service Cards)
       ═══════════════════════════════════════ */

    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    /* ═══════════════════════════════════════
       10. CONTACT FORM
       ═══════════════════════════════════════ */

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
                btn.style.background = '#28CA41';
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


    /* ═══════════════════════════════════════
       11. WORD REVEAL ANIMATION
       ═══════════════════════════════════════ */

    const wordRevealEls = document.querySelectorAll('.word-reveal');
    wordRevealEls.forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text.split(' ').map((word, i) =>
            `<span class="word" style="transition-delay: ${i * 0.08}s">${word}</span>`
        ).join(' ');
    });


    /* ═══════════════════════════════════════
       12. MAGNETIC BUTTONS
       ═══════════════════════════════════════ */

    const magneticBtns = document.querySelectorAll('.btn-primary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

})();
