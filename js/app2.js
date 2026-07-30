/* =============================================
   KHEBRA TECH — App Logic v2
   Terminal Typing · Counter Animation · Spotlight
   Magnetic Buttons · Flip Cards · Scroll Reveal
   ============================================= */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. TERMINAL TYPING EFFECT (Hero)
     ═══════════════════════════════════════════ */
  const terminalBody = document.getElementById('terminalBody');

  if (terminalBody) {
    const lines = [
      {
        text: '> scanning_vulnerabilities --target your_business',
        classes: [
          { text: '> ', cls: 'term-prompt-char' },
          { text: 'scanning_vulnerabilities', cls: 'term-cmd' },
          { text: ' --target ', cls: 'term-flag' },
          { text: 'your_business', cls: 'term-result' },
        ]
      },
      {
        text: '  [████████████████████░░░] 87% threats detected',
        classes: [
          { text: '  [████████████████████░░░] ', cls: 'term-result' },
          { text: '87% threats detected', cls: 'term-error' },
        ]
      },
      {
        text: '> deploying khebra_shield v3.0...',
        classes: [
          { text: '> ', cls: 'term-prompt-char' },
          { text: 'deploying', cls: 'term-cmd' },
          { text: ' khebra_shield v3.0...', cls: 'term-result' },
        ]
      },
      {
        text: '  ✓ All systems secured. Welcome to Khebra Tech.',
        classes: [
          { text: '  ✓ ', cls: 'term-success' },
          { text: 'All systems secured. ', cls: 'term-success' },
          { text: 'Welcome to Khebra Tech.', cls: 'term-cmd' },
        ]
      }
    ];

    let currentLine = 0;
    let currentSegment = 0;
    let currentChar = 0;
    let lineElement = document.getElementById('termLine0');

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.textContent = '';

    function typeNext() {
      if (currentLine >= lines.length) {
        // All done, remove cursor
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        // Restart after a pause
        setTimeout(function() {
          resetTerminal();
        }, 5000);
        return;
      }

      const line = lines[currentLine];
      const segment = line.classes[currentSegment];

      if (!segment) {
        // Move to next line
        currentLine++;
        currentSegment = 0;
        currentChar = 0;

        if (currentLine < lines.length) {
          lineElement = document.createElement('div');
          lineElement.className = 'terminal-line';
          lineElement.id = 'termLine' + currentLine;
          terminalBody.appendChild(lineElement);

          // Pause between lines
          setTimeout(typeNext, 400);
        } else {
          typeNext();
        }
        return;
      }

      // Create or find the span for this segment
      let span = lineElement.querySelector('[data-seg="' + currentLine + '-' + currentSegment + '"]');
      if (!span) {
        span = document.createElement('span');
        span.className = segment.cls;
        span.setAttribute('data-seg', currentLine + '-' + currentSegment);
        span.textContent = '';
        lineElement.appendChild(span);
      }

      // Remove cursor from previous position and add after current span
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      lineElement.appendChild(cursor);

      // Type one character
      span.textContent += segment.text[currentChar];
      currentChar++;

      if (currentChar >= segment.text.length) {
        // Move to next segment
        currentSegment++;
        currentChar = 0;
        setTimeout(typeNext, 30);
      } else {
        // Random delay for realistic typing
        var delay = 25 + Math.random() * 35;
        // Faster for progress bar characters
        if (segment.text[currentChar] === '█' || segment.text[currentChar] === '░') {
          delay = 8;
        }
        setTimeout(typeNext, delay);
      }
    }

    function resetTerminal() {
      currentLine = 0;
      currentSegment = 0;
      currentChar = 0;

      // Clear all lines except the first
      terminalBody.innerHTML = '';
      lineElement = document.createElement('div');
      lineElement.className = 'terminal-line';
      lineElement.id = 'termLine0';
      terminalBody.appendChild(lineElement);

      setTimeout(typeNext, 800);
    }

    // Start typing after hero animation
    setTimeout(typeNext, 1800);
  }


  /* ═══════════════════════════════════════════
     2. COUNTER ANIMATION (Social Proof)
     ═══════════════════════════════════════════ */
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number, .flip-stat-number');

    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;

      var target = parseInt(counter.dataset.target, 10);
      if (isNaN(target)) return;

      counter.dataset.animated = 'true';
      var start = 0;
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Observe stat cards for counter animation
  var statCards = document.querySelectorAll('.stat-card, .flip-card-back');
  if (statCards.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Small delay for visual effect
          setTimeout(function () {
            var nums = entry.target.querySelectorAll('.stat-number, .flip-stat-number');
            nums.forEach(function (n) {
              if (!n.dataset.animated) {
                animateCounterSingle(n);
              }
            });
          }, 300);
        }
      });
    }, { threshold: 0.3 });

    statCards.forEach(function (card) {
      counterObserver.observe(card);
    });
  }

  function animateCounterSingle(counter) {
    var target = parseInt(counter.dataset.target, 10);
    if (isNaN(target) || counter.dataset.animated) return;

    counter.dataset.animated = 'true';
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // Trigger flip card back counters when the card is hovered (desktop only)
  var flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(function (card) {
    var triggered = false;
    card.addEventListener('mouseenter', function () {
      if (triggered) return;
      triggered = true;
      setTimeout(function () {
        var nums = card.querySelectorAll('.flip-stat-number');
        nums.forEach(function (n) {
          if (!n.dataset.animated) {
            animateCounterSingle(n);
          }
        });
      }, 400);
    });
  });


  /* ═══════════════════════════════════════════
     3. SPOTLIGHT EFFECT (Card Mouse Glow)
     ═══════════════════════════════════════════ */
  if (matchMedia('(hover: hover)').matches) {
    var spotlightCards = document.querySelectorAll('.spotlight-card');

    spotlightCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', x + 'px');
        card.style.setProperty('--spotlight-y', y + 'px');
      });
    });
  }


  /* ═══════════════════════════════════════════
     4. MAGNETIC BUTTONS (Desktop only)
     ═══════════════════════════════════════════ */
  if (matchMedia('(hover: hover)').matches) {
    var magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.18) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () {
          btn.style.transition = '';
        }, 400);
      });
    });
  }


  /* ═══════════════════════════════════════════
     5. SCROLL REVEAL (IntersectionObserver)
     ═══════════════════════════════════════════ */
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);

            // Trigger counter animation for stat cards
            if (entry.target.classList.contains('stat-card') || entry.target.closest('.stats')) {
              var nums = entry.target.querySelectorAll('.stat-number');
              nums.forEach(function (n) {
                if (!n.dataset.animated) {
                  setTimeout(function() { animateCounterSingle(n); }, 500);
                }
              });
            }
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


  /* ═══════════════════════════════════════════
     6. HEADER SCROLL EFFECT
     ═══════════════════════════════════════════ */
  var header = document.getElementById('siteHeader');

  if (header) {
    var lastScroll = 0;
    var ticking = false;

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


  /* ═══════════════════════════════════════════
     7. MOBILE MENU
     ═══════════════════════════════════════════ */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('mainNav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
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


  /* ═══════════════════════════════════════════
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var y = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });


  /* ═══════════════════════════════════════════
     9. HIDE SCROLL HINT ON SCROLL
     ═══════════════════════════════════════════ */
  var scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    var hintHidden = false;
    window.addEventListener('scroll', function () {
      if (!hintHidden && window.scrollY > 100) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.5s ease';
        hintHidden = true;
      }
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════
     10. CONTACT FORM (Terminal-style feedback)
     ═══════════════════════════════════════════ */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector('.term-submit');
      var origHTML = btn.innerHTML;

      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> جاري التشفير والإرسال...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(function () {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><path d="M20 6L9 17l-5-5"/></svg> ✓ تم استقبال طلبك بنجاح';
        btn.style.background = '#059669';
        btn.style.opacity = '1';
        contactForm.reset();

        setTimeout(function () {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 2000);
    });
  }

})();
