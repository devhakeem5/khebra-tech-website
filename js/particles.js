/* =============================================
   KHEBRA TECH — Particle Network
   Full-page interactive particle system (Canvas 2D)
   Lightweight: no Three.js dependency
   ============================================= */

(function () {
  'use strict';

  var canvas = document.getElementById('particleNetwork');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouseX = -1000;
  var mouseY = -1000;
  var isVisible = true;
  var animationId = null;

  /* ── Config ──────────────────────────────── */
  var config = {
    particleCount: 60,
    maxDistance: 150,
    mouseRadius: 200,
    particleSize: 1.5,
    speed: 0.3,
    lineColor: '59, 130, 246',    /* accent blue */
    particleColor: '96, 165, 250', /* accent light */
    lineOpacity: 0.12,
    particleOpacity: 0.4,
  };

  /* Reduce particles on mobile */
  if (window.innerWidth < 768) {
    config.particleCount = 30;
    config.maxDistance = 120;
  }

  /* ── Resize ──────────────────────────────── */
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      initParticles();
    }, 200);
  });

  /* ── Mouse Tracking ──────────────────────── */
  if (matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      mouseX = -1000;
      mouseY = -1000;
    });
  }

  /* ── Visibility Check ────────────────────── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      isVisible = false;
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      isVisible = true;
      animate();
    }
  });

  /* ── Particle Class ──────────────────────── */
  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * config.speed;
    this.vy = (Math.random() - 0.5) * config.speed;
    this.size = config.particleSize + Math.random() * 1;
    this.baseOpacity = config.particleOpacity * (0.5 + Math.random() * 0.5);
    this.opacity = this.baseOpacity;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    /* Wrap around edges */
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    /* Mouse repulsion (subtle) */
    var dx = this.x - mouseX;
    var dy = this.y - mouseY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < config.mouseRadius) {
      var force = (config.mouseRadius - dist) / config.mouseRadius;
      var angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * force * 1.5;
      this.y += Math.sin(angle) * force * 1.5;

      /* Glow near mouse */
      this.opacity = Math.min(1, this.baseOpacity + force * 0.6);
    } else {
      this.opacity += (this.baseOpacity - this.opacity) * 0.05;
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + config.particleColor + ', ' + this.opacity + ')';
    ctx.fill();
  };

  /* ── Initialize ──────────────────────────── */
  function initParticles() {
    particles = [];
    for (var i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  /* ── Draw Connections ────────────────────── */
  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          var opacity = config.lineOpacity * (1 - dist / config.maxDistance);

          /* Brighten connections near mouse */
          var midX = (particles[i].x + particles[j].x) / 2;
          var midY = (particles[i].y + particles[j].y) / 2;
          var mouseDist = Math.sqrt(
            (midX - mouseX) * (midX - mouseX) +
            (midY - mouseY) * (midY - mouseY)
          );

          if (mouseDist < config.mouseRadius) {
            opacity *= 1 + (1 - mouseDist / config.mouseRadius) * 3;
          }

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + config.lineColor + ', ' + opacity + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    /* Draw connections from mouse to nearby particles */
    if (mouseX > 0 && mouseY > 0) {
      for (var k = 0; k < particles.length; k++) {
        var mx = particles[k].x - mouseX;
        var my = particles[k].y - mouseY;
        var mDist = Math.sqrt(mx * mx + my * my);

        if (mDist < config.mouseRadius * 1.2) {
          var mOpacity = 0.15 * (1 - mDist / (config.mouseRadius * 1.2));
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(particles[k].x, particles[k].y);
          ctx.strokeStyle = 'rgba(' + config.lineColor + ', ' + mOpacity + ')';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Animation Loop ──────────────────────── */
  function animate() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  animate();

})();
