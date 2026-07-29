/* =============================================
   KHEBRA TECH — 3D Logo Scene (Three.js)
   Faithful recreation of the logo as 3D geometry
   with glow, particles, and mouse interaction
   ============================================= */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Setup ─────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(3, 1.5, 11);
  camera.lookAt(0, 0, 0);

  /* ── Resize ────────────────────────────────── */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Materials ─────────────────────────────── */
  const mainMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1e5294,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x1a4a8a,
    emissiveIntensity: 0.5,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
  });

  const accentMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x4a90f7,
    metalness: 0.75,
    roughness: 0.12,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.7,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98,
  });

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.6,
    linewidth: 1,
  });

  /* ── Logo Group ────────────────────────────── */
  const logoGroup = new THREE.Group();
  logoGroup.rotation.x = 0.15;
  logoGroup.rotation.y = 0.4;

  /*
   * Logo geometry derived from pixel analysis of logo.png:
   *   Image: 1536×1024, logo bounds: x[481..1054] y[58..1007]
   *   Normalized to [-1,+1] on Y-axis (height=949px)
   *
   *   Part 1 — Small top diamond (dot):
   *     Center: (0, +0.82), half-diagonal: 0.185
   *     Solid, no hole. Separated from main body by a gap.
   *
   *   Part 2 — Large diamond frame:
   *     Center: (0, 0), outer half-diag: 0.604, hole half-diag: 0.24
   *     Diamond-shaped hole in the center.
   *
   *   Part 3 — Bottom tail diamond:
   *     Center: (+0.05, -0.83), half-diag: 0.28
   *     Overlaps bottom-left of main diamond — connected, not separate.
   *     Same orientation (not rotated).
   *
   *   All scaled by S = 3.6 for scene size.
   */
  const S = 3.6;

  const extrudeMain = {
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 4,
  };

  const extrudeSmall = {
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 3,
  };

  /* Helper: create diamond shape */
  function makeDiamond(halfDiag) {
    var s = new THREE.Shape();
    s.moveTo(0, halfDiag);
    s.lineTo(halfDiag, 0);
    s.lineTo(0, -halfDiag);
    s.lineTo(-halfDiag, 0);
    s.closePath();
    return s;
  }

  /* ─── Part 1: Small diamond dot (top) ─── */
  var dotR = 0.185 * S;
  var dotShape = makeDiamond(dotR);
  var dotGeo = new THREE.ExtrudeGeometry(dotShape, extrudeSmall);
  dotGeo.center();
  var dotMesh = new THREE.Mesh(dotGeo, accentMaterial);
  dotMesh.position.y = 0.82 * S;
  logoGroup.add(dotMesh);

  var dotEdges = new THREE.EdgesGeometry(dotGeo, 30);
  var dotLines = new THREE.LineSegments(dotEdges, edgeMaterial);
  dotLines.position.y = 0.82 * S;
  logoGroup.add(dotLines);

  /* Dot glow */
  var dotGlowGeo = new THREE.ShapeGeometry(dotShape);
  var dotGlowMesh = new THREE.Mesh(dotGlowGeo, new THREE.MeshBasicMaterial({
    color: 0x3b82f6, transparent: true, opacity: 0.12, side: THREE.DoubleSide,
  }));
  dotGlowMesh.position.set(0, 0.82 * S, -0.35);
  dotGlowMesh.scale.set(1.7, 1.7, 1);
  logoGroup.add(dotGlowMesh);

  /* ─── Part 2: Large diamond frame with hole ─── */
  var outerR = 0.604 * S;
  var holeR = 0.24 * S;

  var frameShape = makeDiamond(outerR);
  var holePath = new THREE.Path();
  holePath.moveTo(0, holeR);
  holePath.lineTo(holeR, 0);
  holePath.lineTo(0, -holeR);
  holePath.lineTo(-holeR, 0);
  holePath.closePath();
  frameShape.holes.push(holePath);

  var frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeMain);
  frameGeo.center();
  var frameMesh = new THREE.Mesh(frameGeo, mainMaterial);
  logoGroup.add(frameMesh);

  var frameEdges = new THREE.EdgesGeometry(frameGeo, 30);
  var frameLines = new THREE.LineSegments(frameEdges, edgeMaterial);
  logoGroup.add(frameLines);

  /* Main glow */
  var glowR = outerR + 0.25;
  var glowShape = makeDiamond(glowR);
  var glowGeo = new THREE.ShapeGeometry(glowShape);
  var glowMesh = new THREE.Mesh(glowGeo, glowMaterial);
  glowMesh.position.z = -0.4;
  logoGroup.add(glowMesh);

  /* ─── Part 3: Bottom tail diamond (overlaps lower-left) ─── */
  var tailR = 0.28 * S;
  var tailX = 0.05 * S;   /* slightly right of center */
  var tailY = -0.83 * S;  /* well below main diamond */

  var tailShape = makeDiamond(tailR);
  var tailGeo = new THREE.ExtrudeGeometry(tailShape, extrudeMain);
  tailGeo.center();
  var tailMesh = new THREE.Mesh(tailGeo, mainMaterial);
  tailMesh.position.set(tailX, tailY, 0);
  logoGroup.add(tailMesh);

  var tailEdges = new THREE.EdgesGeometry(tailGeo, 30);
  var tailLines = new THREE.LineSegments(tailEdges, edgeMaterial);
  tailLines.position.set(tailX, tailY, 0);
  logoGroup.add(tailLines);

  /* ─── Position the whole logo ─── */
  logoGroup.position.y = -0.2;
  scene.add(logoGroup);

  /* ── Particles ─────────────────────────────── */
  const particleCount = 280;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const speeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3.5 + Math.random() * 5;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = 1.5 + Math.random() * 3;
    speeds[i] = 0.2 + Math.random() * 0.6;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0x60a5fa,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Lights ────────────────────────────────── */
  const ambientLight = new THREE.AmbientLight(0x1a2a4a, 0.8);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x3b82f6, 3.5, 25);
  pointLight1.position.set(3, 4, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x60a5fa, 2.5, 22);
  pointLight2.position.set(-4, -2, 4);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x1e40af, 1.2, 15);
  pointLight3.position.set(0, -4, -3);
  scene.add(pointLight3);

  /* ── Mouse Interaction ─────────────────────── */
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  if (matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ── Visibility Check ──────────────────────── */
  let isVisible = true;
  const observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(canvas);

  /* ── Animation Loop ────────────────────────── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const t = clock.getElapsedTime();

    /* Slow auto-rotation */
    const autoRotY = t * 0.12;
    const autoRotX = Math.sin(t * 0.08) * 0.08;

    /* Smooth mouse influence */
    targetRotX += (mouseY * 0.15 - targetRotX) * 0.03;
    targetRotY += (mouseX * 0.2 - targetRotY) * 0.03;

    logoGroup.rotation.y = autoRotY + targetRotY;
    logoGroup.rotation.x = autoRotX + targetRotX;

    /* Subtle breathing scale */
    const breathe = 1 + Math.sin(t * 0.5) * 0.015;
    logoGroup.scale.set(breathe, breathe, breathe);

    /* Animate particles */
    const posArr = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const s = speeds[i];
      posArr[idx] += Math.sin(t * s + i) * 0.002;
      posArr[idx + 1] += Math.cos(t * s + i * 0.7) * 0.002;
      posArr[idx + 2] += Math.sin(t * s * 0.5 + i * 1.3) * 0.001;
    }
    particleGeo.attributes.position.needsUpdate = true;

    /* Slowly rotate particles */
    particles.rotation.y = t * 0.015;
    particles.rotation.x = t * 0.008;

    /* Animate lights subtly */
    pointLight1.intensity = 2.5 + Math.sin(t * 0.7) * 0.4;
    pointLight2.intensity = 1.8 + Math.cos(t * 0.5) * 0.3;

    renderer.render(scene, camera);
  }

  animate();
})();
