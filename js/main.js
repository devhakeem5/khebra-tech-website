/* ========================================
   KHEBRA TECH — Main JS v3 (VIP Edition)
   Three.js · GSAP · Custom Cursor · Magnetic
   ======================================== */

(function () {
    'use strict';

    /* ═══════════════════════════════════════
       1. CUSTOM CURSOR
       ═══════════════════════════════════════ */
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Slight delay for the outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Hover effect for interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea, select, .service-card, .about-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ═══════════════════════════════════════
       2. THREE.JS VIP BACKGROUND
       ═══════════════════════════════════════ */
    const canvas = document.getElementById('heroCanvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        // Deep void background
        scene.background = null; 

        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create a particle system based on logo image
        let logoParticles = null;
        
        const img = new Image();
        img.src = 'assets/images/logo.png';
        img.onload = () => {
            const hiddenCanvas = document.createElement('canvas');
            const ctx = hiddenCanvas.getContext('2d');
            
            // Higher width = more particles (denser)
            const targetWidth = 140; 
            const targetHeight = Math.floor((img.height / img.width) * targetWidth);
            hiddenCanvas.width = targetWidth;
            hiddenCanvas.height = targetHeight;
            
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
            
            const positions = [];
            const colors = [];
            
            for(let y = 0; y < targetHeight; y++) {
                for(let x = 0; x < targetWidth; x++) {
                    const idx = (y * targetWidth + x) * 4;
                    const a = imgData[idx+3];
                    
                    if (a > 100) { // Non-transparent pixels
                        const pX = (x - targetWidth / 2) * 0.35;
                        const pY = -(y - targetHeight / 2) * 0.35;
                        const pZ = (Math.random() - 0.5) * 2; // subtle thickness
                        
                        // Store base position and current position
                        positions.push(pX, pY, pZ);
                        // Cyan color #00D4FF
                        colors.push(0.0, 0.83, 1.0);
                    }
                }
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            // Store original coordinates for wave animation
            geometry.setAttribute('basePosition', new THREE.Float32BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.18,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            
            logoParticles = new THREE.Points(geometry, material);
            scene.add(logoParticles);
        };

        // Add some glowing ambient dust
        const dustGeo = new THREE.BufferGeometry();
        const dustCount = 400;
        const dustPos = new Float32Array(dustCount * 3);
        for(let i = 0; i < dustCount * 3; i++) {
            dustPos[i] = (Math.random() - 0.5) * 80;
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x00D4FF,
            transparent: true,
            opacity: 0.3
        });
        const dustMesh = new THREE.Points(dustGeo, dustMat);
        scene.add(dustMesh);

        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            if (logoParticles) {
                // Interactive 3D tilt based on mouse
                logoParticles.rotation.y = mouseX * 0.3;
                logoParticles.rotation.x = mouseY * 0.3;
                
                // Tech wave animation
                const positions = logoParticles.geometry.attributes.position.array;
                const basePositions = logoParticles.geometry.attributes.basePosition.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const x = basePositions[i];
                    const y = basePositions[i+1];
                    // Add a dynamic wave across the Z axis
                    positions[i + 2] = basePositions[i + 2] + Math.sin(time * 2 + x * 0.5 + y * 0.5) * 0.5;
                }
                logoParticles.geometry.attributes.position.needsUpdate = true;
            }

            dustMesh.rotation.y = time * 0.05;
            dustMesh.rotation.x = time * 0.02;
            
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        });
    }

    /* ═══════════════════════════════════════
       3. GSAP SCROLL REVEALS (VIP Smoothness)
       ═══════════════════════════════════════ */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Parallax
        gsap.to('.hero-content', {
            yPercent: 30,
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Staggered reveals for cards
        const cardGroups = ['.about-cards', '.services-grid', '.diff-grid', '.numbers-grid'];
        cardGroups.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                const children = container.children;
                gsap.from(children, {
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 85%",
                    }
                });
            }
        });

        // Title reveals
        gsap.utils.toArray('.section-label, .about-title, .diff-title').forEach(title => {
            gsap.from(title, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%"
                }
            });
        });
    }

    /* ═══════════════════════════════════════
       3b. SERVICE SHOWCASE SWITCHER
       ═══════════════════════════════════════ */
    (function () {
        const tabs      = document.querySelectorAll('.svc-tab');
        const panes     = document.querySelectorAll('.svc-pane');
        const indicator = document.getElementById('svcIndicator');
        const showcase  = document.querySelector('.svc-showcase');
        if (!tabs.length || !panes.length) return;

        let current = 0;
        let autoTimer = null;

        function getIndicatorTop(index) {
            const selector = document.getElementById('svcSelector');
            const track    = selector ? selector.querySelector('.svc-selector-track') : null;
            if (!track) return 0;
            const tabEls = selector.querySelectorAll('.svc-tab');
            if (!tabEls[index]) return 0;
            const tabRect  = tabEls[index].getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            return tabRect.top - trackRect.top;
        }

        function switchTo(index) {
            if (index === current) return;

            // Deactivate old
            tabs[current].classList.remove('active');
            panes[current].classList.remove('active');

            // Activate new
            current = index;
            tabs[current].classList.add('active');
            panes[current].classList.add('active');

            // Move indicator (only when selector-track is visible)
            if (indicator && getComputedStyle(indicator).display !== 'none') {
                indicator.style.top = getIndicatorTop(current) + 'px';
            }
        }

        // Wire tabs
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => {
                switchTo(i);
                clearInterval(autoTimer);
                startAuto();
            });
        });

        // Init indicator position
        if (indicator) {
            indicator.style.top = getIndicatorTop(0) + 'px';
        }

        // Auto-rotate every 5 s, pause on hover
        function startAuto() {
            autoTimer = setInterval(() => {
                switchTo((current + 1) % tabs.length);
            }, 5000);
        }

        startAuto();

        if (showcase) {
            showcase.addEventListener('mouseenter', () => clearInterval(autoTimer));
            showcase.addEventListener('mouseleave', () => { clearInterval(autoTimer); startAuto(); });
        }

        // Recalculate indicator on resize
        window.addEventListener('resize', () => {
            if (indicator) indicator.style.top = getIndicatorTop(current) + 'px';
        });
    })();


    /* ═══════════════════════════════════════
       4. HEADER SCROLL & MOBILE MENU
       ═══════════════════════════════════════ */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if(header) header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

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
       5. ACTIVE NAV & SMOOTH SCROLL
       ═══════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const y = window.scrollY + 120;
        sections.forEach(s => {
            const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
            if (link) {
                link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
            }
        });
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
        });
    });

    /* ═══════════════════════════════════════
       6. MAGNETIC BUTTONS & TILT
       ═══════════════════════════════════════ */
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-ghost');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 20;
            const y = -(e.clientY - rect.top - rect.height / 2) / 20;
            card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ═══════════════════════════════════════
       7. CONTACT FORM (Simulated)
       ═══════════════════════════════════════ */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>جاري التشفير والإرسال...</span>';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<span>✓ تم استقبال طلبك بنجاح</span>';
                btn.style.background = '#28CA41';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }, 2000);
        });
    }

})();
