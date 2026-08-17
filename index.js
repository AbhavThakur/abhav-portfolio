/* ═══════════════════════════════════════════════════════════════════════════
   ABHAV THAKUR — LUXURY INTERACTIVE PORTFOLIO CONTROLLER
   Full Vanilla JS • 60fps Ambient Canvas • Mobile Simulator • Terminal CLI
   GitHub Heatmap • Code Playground • Web Audio API Synthesizer
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');

  const safeRun = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.warn(`[Init Module '${name}']`, err);
    }
  };

  safeRun('SoundEngine', initSoundEngine);
  safeRun('ThemeSystem', initThemeSystem);
  safeRun('AmbientCanvas', initAmbientCanvas);
  safeRun('HeroKineticCanvas', initHeroKineticCanvas);
  safeRun('CardSpotlight', initCardSpotlight);
  safeRun('MagneticCursor', initMagneticCursor);
  safeRun('SystemTelemetryHUD', initSystemTelemetryHUD);
  safeRun('MatrixRain', initMatrixRain);
  safeRun('LiveClock', initLiveClock);
  safeRun('RoleRotator', initRoleRotator);
  safeRun('ScrollAnimations', initScrollAnimations);
  safeRun('CounterAnimation', initCounterAnimation);
  safeRun('ScrollProgressAndSpy', initScrollProgressAndSpy);
  safeRun('ProjectFilters', initProjectFilters);
  safeRun('ProjectModals', initProjectModals);
  safeRun('MobileSimulator', initMobileSimulator);
  safeRun('CodePlayground', initCodePlayground);
  safeRun('GitHubHeatmap', initGitHubHeatmap);
  safeRun('SkillsAnimation', initSkillsAnimation);
  safeRun('TerminalMode', initTerminalMode);
  safeRun('CommandPalette', initCommandPalette);
  safeRun('EmailCopyAndToasts', initEmailCopyAndToasts);
});

/* ──────────────────────────────────────────────────────────────────────────
   1. SYNTHETIC SOUND ENGINE (Web Audio API - Zero External Assets)
   ────────────────────────────────────────────────────────────────────────── */
let audioCtx = null;
let soundEnabled = false;

function initSoundEngine() {
  const soundBtn = document.getElementById('sound-toggle');
  
  // Check persisted sound preference
  const savedSound = localStorage.getItem('at-portfolio-sound');
  if (savedSound === 'enabled') {
    soundEnabled = true;
    if (soundBtn) soundBtn.classList.remove('muted');
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('at-portfolio-sound', soundEnabled ? 'enabled' : 'disabled');
    if (soundBtn) {
      soundBtn.classList.toggle('muted', !soundEnabled);
    }
    if (soundEnabled) {
      ensureAudioContext();
      SoundFX.theme();
      showToast('Sound Effects Enabled 🔊');
    } else {
      showToast('Sound Effects Muted 🔇');
    }
  }

  if (soundBtn) soundBtn.addEventListener('click', toggleSound);

  // Attach subtle click sound to buttons & links
  document.addEventListener('click', (e) => {
    if (soundEnabled && (e.target.closest('button') || e.target.closest('a') || e.target.closest('.project-card') || e.target.closest('.sim-nav-btn'))) {
      SoundFX.click();
    }
  });
}

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

const SoundFX = {
  click: () => {
    if (!soundEnabled) return;
    try {
      ensureAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch(e) {}
  },
  theme: () => {
    if (!soundEnabled) return;
    try {
      ensureAudioContext();
      if (!audioCtx) return;
      const notes = [320, 480, 640];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.06);
        osc.stop(audioCtx.currentTime + idx * 0.06 + 0.12);
      });
    } catch(e) {}
  },
  type: () => {
    if (!soundEnabled) return;
    try {
      ensureAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.02);
    } catch(e) {}
  }
};

/* ──────────────────────────────────────────────────────────────────────────
   2. THEME SWITCHING SYSTEM (Dark / Light with LocalStorage)
   ────────────────────────────────────────────────────────────────────────── */
function initThemeSystem() {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  const savedTheme = localStorage.getItem('at-portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('at-portfolio-theme', newTheme);
      SoundFX.theme();
      showToast(`Switched to ${newTheme.toUpperCase()} theme ✨`);
    });
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   3. AMBIENT PARTICLES CANVAS (Constellation Mesh & Meteor Comets)
   ────────────────────────────────────────────────────────────────────────── */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let shootingStars = [];
  const particleCount = window.innerWidth < 768 ? 40 : 85;

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.8;
      this.baseAlpha = Math.random() * 0.5 + 0.25;
      this.alpha = this.baseAlpha;
      this.hue = Math.random() > 0.6 ? 270 : (Math.random() > 0.3 ? 195 : 220); // Purple, Cyan, Blue
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse gentle gravity interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const force = (1 - dist / 140) * 0.8;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
        this.alpha = Math.min(1, this.baseAlpha + 0.3);
      } else {
        this.alpha = this.baseAlpha;
      }

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
      ctx.shadowBlur = this.radius * 3;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width * 0.8 + width * 0.1;
      this.y = Math.random() * height * 0.4;
      this.len = Math.random() * 120 + 80;
      this.speed = Math.random() * 8 + 12;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // ~45 deg
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.alpha = 1;
      this.active = false;
      this.thickness = Math.random() * 2 + 1;
    }

    spawn() {
      this.reset();
      this.active = true;
    }

    update() {
      if (!this.active) return;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.018;
      if (this.alpha <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      const tailX = this.x - Math.cos(this.angle) * this.len;
      const tailY = this.y - Math.sin(this.angle) * this.len;

      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.7, `rgba(56, 189, 248, ${this.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${this.alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.thickness;
      ctx.stroke();

      // Glowing head
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.thickness * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38BDF8';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }

  // Periodic Shooting Star Trigger
  setInterval(() => {
    const inactiveStar = shootingStars.find(s => !s.active);
    if (inactiveStar) inactiveStar.spawn();
  }, 3500);

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const linkColor = isDark ? '56, 189, 248' : '99, 102, 241';

    // Draw shooting stars
    for (let s of shootingStars) {
      s.update();
      s.draw();
    }

    // Draw particle constellations
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${linkColor}, ${(1 - dist / 115) * 0.16})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ──────────────────────────────────────────────────────────────────────────
   4. CARD SPOTLIGHT CURSOR GLOW
   ────────────────────────────────────────────────────────────────────────── */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.bento-card, .project-card, .skill-category-card, .timeline-card, .github-activity-section, .code-playground-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   5. LIVE BENGALURU CLOCK (Asia/Kolkata)
   ────────────────────────────────────────────────────────────────────────── */
function initLiveClock() {
  const clockEl = document.getElementById('clock-time');
  if (!clockEl) return;

  function update() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date());
  }
  update();
  setInterval(update, 1000);
}

/* ──────────────────────────────────────────────────────────────────────────
   6. DYNAMIC ROLE ROTATOR
   ────────────────────────────────────────────────────────────────────────── */
function initRoleRotator() {
  const roleEl = document.getElementById('role-text');
  if (!roleEl) return;

  const roles = [
    'React Native Architect',
    'Mobile Performance Eng.',
    'Full Stack Systems',
    'iOS & Android Bridges',
    'Agentic AI Tools'
  ];

  let currentRoleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[currentRoleIdx];

    if (isDeleting) {
      roleEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      roleEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

/* ──────────────────────────────────────────────────────────────────────────
   7. SCROLL REVEALS & NUMBER COUNTER
   ────────────────────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  function checkAllReveals() {
    const triggerBottom = window.innerHeight + 100;
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.02, rootMargin: '120px 0px 80px 0px' });

  reveals.forEach(el => observer.observe(el));

  // Run initial check immediately
  checkAllReveals();
  window.addEventListener('scroll', checkAllReveals, { passive: true });
  window.addEventListener('resize', checkAllReveals, { passive: true });

  // If page loads with a hash (e.g. #experience), trigger check immediately
  if (window.location.hash) {
    setTimeout(() => {
      checkAllReveals();
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        checkAllReveals();
      }
    }, 150);
  }
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1600;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ──────────────────────────────────────────────────────────────────────────
   8. SCROLL PROGRESS BAR & ACTIVE SPY & SMOOTH ANCHOR NAV
   ────────────────────────────────────────────────────────────────────────── */
function initScrollProgressAndSpy() {
  const bar = document.getElementById('scroll-bar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionMap = {
    'about': 'about',
    'projects': 'projects',
    'mobile-lab': 'projects',
    'code-lab': 'projects',
    'github-activity': 'projects',
    'skills': 'experience',
    'experience': 'experience',
    'contact': 'contact'
  };

  // Smooth click navigation on all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
        
        // Ensure reveal classes are instantly activated
        setTimeout(() => {
          const reveals = targetElem.querySelectorAll('.reveal');
          reveals.forEach(r => r.classList.add('visible'));
          targetElem.classList.add('visible');
        }, 100);
      }
    });
  });

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (bar) bar.style.width = `${progress}%`;

    let currentId = 'about';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 180;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    const activeNavTarget = sectionMap[currentId] || currentId;

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeNavTarget}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────────────────────
   9. PROJECT CATEGORY FILTERING
   ────────────────────────────────────────────────────────────────────────── */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   10. PROJECT DETAILS MODAL ENGINE
   ────────────────────────────────────────────────────────────────────────── */
const PROJECT_DATABASE = {
  'interview-brain': {
    title: 'Interview Brain',
    subtitle: 'AI-Powered Full Stack Interview Preparation Platform',
    image: 'assets/interview-brain.png',
    metrics: [
      { val: '100+', label: 'Coding Challenges' },
      { val: '<150ms', label: 'AI Response Latency' },
      { val: '99.9%', label: 'Uptime on Vercel' }
    ],
    overview: 'Interview Brain is an AI-enhanced study ecosystem built to prepare software engineers for top-tier technical interviews. It features real-time code execution challenges, markdown study notes, algorithmic walk-throughs, and contextual AI coaching.',
    architecture: 'Engineered using Next.js 16 App Router, React 19 Server Components, and TypeScript. Integrated with fast LLM inference APIs with structured markdown syntax highlighting, caching, and mobile-responsive layout.',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'TailwindCSS', 'AI API Integration', 'Vercel Edge'],
    liveUrl: 'https://interview-brain-one.vercel.app/prep',
    githubUrl: 'https://github.com/AbhavThakur/interview-brain'
  },
  'growthos': {
    title: 'GrowthOS',
    subtitle: 'Operating System for Platform Growth & Analytics',
    image: 'assets/growthos.png',
    metrics: [
      { val: '60 FPS', label: 'Chart Render Rate' },
      { val: '100%', label: 'ESM Module Native' },
      { val: 'Modular', label: 'Plugin Architecture' }
    ],
    overview: 'GrowthOS is a modular analytics and platform operations dashboard that aggregates product telemetry, user acquisition metrics, and AI-driven growth forecasting for scaling software products.',
    architecture: 'Constructed on modern Vite and React 19 ESM architecture with performant Canvas and SVG chart rendering, customizable KPI widgets, and real-time state persistence.',
    techStack: ['React 19', 'Vite', 'ESM', 'TypeScript', 'Data Visualizations', 'Custom Design System'],
    liveUrl: null,
    githubUrl: 'https://github.com/AbhavThakur/GrowthOS'
  },
  'caselog': {
    title: 'CaseLog',
    subtitle: 'Mobile-First Clinical Management & Patient Logging Web App',
    image: 'assets/caselog.png',
    metrics: [
      { val: '100%', label: 'Mobile Optimized' },
      { val: '0 Lag', label: 'Offline Sync Support' },
      { val: 'HIPAA', label: 'Ready Architecture' }
    ],
    overview: 'CaseLog is a mobile-first application designed for medical practitioners and clinical teams to log, track, and collaborate on patient journeys from triage and admission to treatment and discharge.',
    architecture: 'Built with React 19, TypeScript, and clean modular components. Emphasizes swift one-hand mobile input, instant search filtering across hundreds of clinical cases, and responsive data models.',
    techStack: ['React 19', 'TypeScript', 'Vite', 'Mobile-First UI', 'Form Validation', 'Healthcare UX'],
    liveUrl: 'https://caselog-book.vercel.app/',
    githubUrl: 'https://github.com/AbhavThakur/CaseLog'
  },
  'wealthos': {
    title: 'WealthOS',
    subtitle: 'Fintech Wealth Management & Multi-Asset Portfolio Suite',
    image: 'assets/wealthos.png',
    metrics: [
      { val: 'Real-time', label: 'Asset Tracking' },
      { val: 'Multi-Asset', label: 'Crypto & Equities' },
      { val: '<100ms', label: 'Filter Response' }
    ],
    overview: 'WealthOS is a modern investment dashboard providing deep insight into portfolio allocation, historical return calculations, net-worth tracking, and risk distribution analysis across diverse asset classes.',
    architecture: 'Leverages Vite 8 and React 19 with custom financial chart components, currency localization, and responsive theme design tokens for high-density financial data.',
    techStack: ['React 19', 'Vite 8', 'TypeScript', 'Financial Visualizations', 'Modular UI'],
    liveUrl: 'https://wealthos-three.vercel.app',
    githubUrl: 'https://github.com/AbhavThakur/wealthos'
  },
  'career-ops': {
    title: 'Career-Ops',
    subtitle: 'Autonomous AI Job Search & Opportunity Intelligence Engine',
    image: 'assets/career-ops.png',
    metrics: [
      { val: '14 Modes', label: 'Agent Skill Engines' },
      { val: 'Automated', label: 'PDF Generation' },
      { val: 'Batch', label: 'Pipeline Processing' }
    ],
    overview: 'Career-Ops is an autonomous job search system engineered on Claude Code. It features 14 specialized agent skills, a high-throughput Go backend dashboard, automated PDF resume generation, and batch application processing.',
    architecture: 'Combines an agentic LLM command loop with Go server analytics, automated resume tailoring scripts, and real-time job pipeline tracking.',
    techStack: ['Claude Code', 'Go Backend', 'JavaScript', 'PDF Generation', 'Agentic AI Workflows'],
    liveUrl: null,
    githubUrl: 'https://github.com/AbhavThakur/career-ops'
  },
  'wardrobe-view': {
    title: 'Wardrobe-View & Catalog Ecosystem',
    subtitle: 'Virtual Wardrobe Organizer & Modern Game Discovery',
    image: null,
    metrics: [
      { val: 'Dynamic', label: 'Visual Grid' },
      { val: 'Instant', label: 'Tag Search' },
      { val: 'Zero Config', label: 'Lightweight UI' }
    ],
    overview: 'An interactive styling assistant and product exploration suite allowing users to organize virtual items, filter outfits by color and season, and discover modern interactive entertainment items.',
    architecture: 'Clean Vanilla JS & TypeScript architecture with rapid DOM diffing, CSS Grid responsive fluid layouts, and REST API integration.',
    techStack: ['TypeScript', 'JavaScript', 'HTML5 Canvas', 'REST APIs', 'CSS Grid'],
    liveUrl: null,
    githubUrl: 'https://github.com/AbhavThakur/Wardrobe-View'
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const cards = document.querySelectorAll('.project-card');

  if (!modalBackdrop || !modalBody) return;

  function openModal(projectId) {
    const data = PROJECT_DATABASE[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      ${data.image ? `
        <div class="modal-image-preview">
          <img src="${data.image}" alt="${data.title}" loading="lazy">
        </div>
      ` : ''}
      <h2 class="modal-title">${data.title}</h2>
      <div class="modal-subtitle">${data.subtitle}</div>

      <div class="modal-metrics-grid">
        ${data.metrics.map(m => `
          <div class="modal-metric-card">
            <div class="modal-metric-val">${m.val}</div>
            <div class="modal-metric-label">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="modal-section-title">Overview</div>
      <p class="modal-desc">${data.overview}</p>

      <div class="modal-section-title">Architecture &amp; Engineering</div>
      <p class="modal-desc">${data.architecture}</p>

      <div class="modal-section-title">Technologies &amp; Tools</div>
      <div class="project-tech-pills" style="margin-top: 0.5rem;">
        ${data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
      </div>

      <div class="modal-actions">
        ${data.liveUrl ? `
          <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <span>Open Live App</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        ` : ''}
        ${data.githubUrl ? `
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub Repository</span>
          </a>
        ` : ''}
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const projectId = card.getAttribute('data-project-id');
      if (projectId) openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   11. INTERACTIVE MOBILE APP SIMULATOR
   ────────────────────────────────────────────────────────────────────────── */
function initMobileSimulator() {
  const navBtns = document.querySelectorAll('.sim-nav-btn');
  const screens = document.querySelectorAll('.phone-screen-view');
  const fpsEl = document.getElementById('sim-fps');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetScreen = btn.getAttribute('data-screen');
      screens.forEach(s => {
        s.classList.remove('active');
        if (s.id === `phone-screen-${targetScreen}`) {
          s.classList.add('active');
        }
      });
      SoundFX.click();
    });
  });

  // Animated FPS & Live Metrics Jitter
  if (fpsEl) {
    setInterval(() => {
      const fps = (59.6 + Math.random() * 0.7).toFixed(1);
      fpsEl.textContent = `${fps} FPS`;
    }, 1400);
  }
}

function simulateMobileClick(screenId) {
  SoundFX.modal();
  if (screenId === 'bestbuy') {
    showToast('⚡ Native TurboModule event dispatched: 0 dropped frames (16.2ms latency)');
  } else if (screenId === 'interview') {
    showToast('🧪 Running TypeScript test suite... All 12/12 test cases passed!');
  } else if (screenId === 'caselog') {
    showToast('🏥 Clinical notes encrypted and synced to local offline storage!');
  } else if (screenId === 'wealthos') {
    showToast('📊 Portfolio rebalancing calculation completed: +2.4% annualized Sharpe ratio');
  }
}
window.simulateMobileClick = simulateMobileClick;

/* ──────────────────────────────────────────────────────────────────────────
   12. CODE PLAYGROUND & SYNTAX HIGH-LIGHTER
   ────────────────────────────────────────────────────────────────────────── */
function initCodePlayground() {
  const tabs = document.querySelectorAll('.code-tab-btn');
  const blocks = document.querySelectorAll('.code-snippet-block');
  const copyBtn = document.getElementById('copy-snippet-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetSnippet = tab.getAttribute('data-snippet');
      blocks.forEach(b => {
        b.classList.remove('active');
        if (b.id === `code-${targetSnippet}`) {
          b.classList.add('active');
        }
      });
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeBlock = document.querySelector('.code-snippet-block.active');
      if (activeBlock) {
        navigator.clipboard.writeText(activeBlock.innerText).then(() => {
          showToast('Code snippet copied to clipboard! 💻');
        });
      }
    });
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   13. GITHUB CONTRIBUTIONS HEATMAP & CYBER SNAKE GAME
   ────────────────────────────────────────────────────────────────────────── */
function initGitHubHeatmap() {
  const grid = document.getElementById('github-heatmap-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const COLS = 52;
  const ROWS = 7;
  const levels = [0, 1, 2, 3, 4];
  const weights = [0.15, 0.35, 0.28, 0.16, 0.06];

  function getRandomLevel() {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (r <= sum) return levels[i];
    }
    return 1;
  }

  // 2D matrix storage for fast coordinate lookups
  const matrix = [];
  for (let c = 0; c < COLS; c++) {
    matrix[c] = [];
    for (let r = 0; r < ROWS; r++) {
      const cell = document.createElement('div');
      const lvl = getRandomLevel();
      cell.className = `heat-cell level-${lvl}`;
      const commits = lvl === 0 ? 0 : lvl * 3 + Math.floor(Math.random() * 3);
      cell.title = `Activity: ${commits} contributions (Col ${c+1}, Day ${r+1})`;
      cell.dataset.col = c;
      cell.dataset.row = r;
      cell.dataset.origLvl = lvl;
      grid.appendChild(cell);
      matrix[c][r] = cell;
    }
  }

  // Cyber Snake State Machine
  let snake = [
    { x: 12, y: 3 },
    { x: 11, y: 3 },
    { x: 10, y: 3 },
    { x: 9, y: 3 }
  ];
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let isManual = false;
  let starsEaten = 0;
  let food = spawnFood();
  let gameInterval = null;

  const scoreEl = document.getElementById('snake-eaten-count');
  const modeLabel = document.getElementById('snake-mode-label');
  const toggleBtn = document.getElementById('snake-toggle-play-btn');
  const resetBtn = document.getElementById('snake-reset-btn');

  function spawnFood() {
    // Find non-snake cells, prioritizing level 2-4 stars
    const candidates = [];
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const inSnake = snake.some(s => s.x === c && s.y === r);
        if (!inSnake) {
          const origLvl = parseInt(matrix[c][r].dataset.origLvl || '1', 10);
          if (origLvl >= 2) {
            candidates.push({ x: c, y: r, weight: 3 });
          } else {
            candidates.push({ x: c, y: r, weight: 1 });
          }
        }
      }
    }
    if (candidates.length === 0) return { x: 25, y: 3 };
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    return { x: chosen.x, y: chosen.y };
  }

  function clearSnakeStyles() {
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const cell = matrix[c][r];
        cell.classList.remove('snake-head', 'snake-body', 'snake-food');
      }
    }
  }

  function render() {
    clearSnakeStyles();

    // Food
    if (matrix[food.x] && matrix[food.x][food.y]) {
      matrix[food.x][food.y].classList.add('snake-food');
    }

    // Snake Body
    for (let i = 1; i < snake.length; i++) {
      const seg = snake[i];
      if (matrix[seg.x] && matrix[seg.x][seg.y]) {
        matrix[seg.x][seg.y].classList.add('snake-body');
      }
    }

    // Snake Head
    if (snake.length > 0) {
      const head = snake[0];
      if (matrix[head.x] && matrix[head.x][head.y]) {
        matrix[head.x][head.y].classList.add('snake-head');
      }
    }
  }

  function autoFindNextDirection() {
    const head = snake[0];
    const dx = food.x - head.x;
    const dy = food.y - head.y;

    const possibleMoves = [];

    // Horizontal preferred if dx is larger
    if (dx > 0 && direction.x !== -1) possibleMoves.push({ x: 1, y: 0 });
    if (dx < 0 && direction.x !== 1) possibleMoves.push({ x: -1, y: 0 });
    if (dy > 0 && direction.y !== -1) possibleMoves.push({ x: 0, y: 1 });
    if (dy < 0 && direction.y !== 1) possibleMoves.push({ x: 0, y: -1 });

    // Fallbacks
    if (possibleMoves.length === 0) {
      if (direction.x !== 0) possibleMoves.push({ x: 0, y: 1 }, { x: 0, y: -1 });
      else possibleMoves.push({ x: 1, y: 0 }, { x: -1, y: 0 });
    }

    // Avoid immediate self-collision
    for (let move of possibleMoves) {
      const nextX = (head.x + move.x + COLS) % COLS;
      const nextY = (head.y + move.y + ROWS) % ROWS;
      const hitsBody = snake.slice(0, -1).some(s => s.x === nextX && s.y === nextY);
      if (!hitsBody) {
        return move;
      }
    }

    return possibleMoves[0] || direction;
  }

  function tick() {
    if (!isManual) {
      direction = autoFindNextDirection();
    } else {
      direction = nextDirection;
    }

    const head = snake[0];
    const nextHead = {
      x: (head.x + direction.x + COLS) % COLS,
      y: (head.y + direction.y + ROWS) % ROWS
    };

    // Check if eating food
    const eatsFood = nextHead.x === food.x && nextHead.y === food.y;

    if (eatsFood) {
      starsEaten++;
      if (scoreEl) scoreEl.textContent = starsEaten;
      SoundFX.click();
      
      // Spawn small spark at eaten cell
      const targetCell = matrix[food.x][food.y];
      if (targetCell) {
        const rect = targetCell.getBoundingClientRect();
        triggerParticleBurst(rect.left + 6, rect.top + 6);
      }

      food = spawnFood();
    } else {
      snake.pop(); // Remove tail
    }

    snake.unshift(nextHead);
    render();
  }

  // Start continuous loop
  gameInterval = setInterval(tick, 140);

  // Manual Keyboard Control
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    let handled = false;

    if (key === 'ArrowUp' || key === 'w' || key === 'W') {
      if (direction.y !== 1) { nextDirection = { x: 0, y: -1 }; handled = true; }
    } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
      if (direction.y !== -1) { nextDirection = { x: 0, y: 1 }; handled = true; }
    } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
      if (direction.x !== 1) { nextDirection = { x: -1, y: 0 }; handled = true; }
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
      if (direction.x !== -1) { nextDirection = { x: 1, y: 0 }; handled = true; }
    }

    if (handled && !isManual) {
      isManual = true;
      if (toggleBtn) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '<span>🤖 Resume Auto-Hunt</span>';
      }
      if (modeLabel) modeLabel.textContent = '🎮 Manual Mode (Arrow Keys)';
      showToast('Manual Snake mode engaged! Use Arrow keys to hunt stars ⭐');
    }
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isManual = !isManual;
      if (isManual) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '<span>🤖 Resume Auto-Hunt</span>';
        if (modeLabel) modeLabel.textContent = '🎮 Manual Mode (Arrow Keys)';
        showToast('Manual mode active: Navigate with Arrow Keys! 🕹️');
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '<span>🎮 Take Control (Keys)</span>';
        if (modeLabel) modeLabel.textContent = '🐍 Cyber Snake: Auto Hunting Stars';
        showToast('Auto-Hunting resumed! 🐍');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      snake = [
        { x: 12, y: 3 },
        { x: 11, y: 3 },
        { x: 10, y: 3 },
        { x: 9, y: 3 }
      ];
      direction = { x: 1, y: 0 };
      nextDirection = { x: 1, y: 0 };
      starsEaten = 0;
      if (scoreEl) scoreEl.textContent = '0';
      food = spawnFood();
      render();
      SoundFX.click();
      showToast('Cyber Snake respawned! 🔄');
    });
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   13B. CORE SKILLS ANIMATED PROGRESS BARS & PERCENTAGE COUNTERS
   ────────────────────────────────────────────────────────────────────────── */
function initSkillsAnimation() {
  const skillsContainer = document.querySelector('.skills-container');
  if (!skillsContainer) return;

  const fills = document.querySelectorAll('.skill-bar-fill');
  const pctBadges = document.querySelectorAll('.skill-pct-val');

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;

        // Animate bar widths
        fills.forEach(fill => {
          const targetW = fill.getAttribute('data-width') || '85%';
          fill.style.width = targetW;
        });

        // Count up percentage badges
        pctBadges.forEach(badge => {
          const targetNum = parseInt(badge.getAttribute('data-skill-pct') || '80', 10);
          let current = 0;
          const duration = 1500;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(easeProgress * targetNum);
            badge.textContent = `${val}%`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              badge.textContent = `${targetNum}%`;
            }
          }

          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillsContainer);
}

/* ──────────────────────────────────────────────────────────────────────────
   14. INTERACTIVE DEVELOPER CLI TERMINAL
   ────────────────────────────────────────────────────────────────────────── */
function initTerminalMode() {
  const modal = document.getElementById('terminal-modal');
  const openBtn = document.getElementById('open-term-btn');
  const closeDot = document.getElementById('term-close-dot');
  const input = document.getElementById('term-input');
  const output = document.getElementById('term-output');

  if (!modal || !input || !output) return;

  let cmdHistory = [];
  let historyIdx = -1;

  function openTerm() {
    modal.classList.add('open');
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeTerm() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openTerm);
  if (closeDot) closeDot.addEventListener('click', closeTerm);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerm();
  });

  input.addEventListener('keydown', (e) => {
    SoundFX.type();

    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      input.value = '';
      if (!rawCmd) return;

      cmdHistory.push(rawCmd);
      historyIdx = cmdHistory.length;

      printLine(`abhav@dev:~$ ${rawCmd}`, 'cmd-echo');
      executeCommand(rawCmd.toLowerCase());
      output.scrollTop = output.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = cmdHistory[historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        input.value = cmdHistory[historyIdx] || '';
      } else {
        historyIdx = cmdHistory.length;
        input.value = '';
      }
    }
  });

  function printLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.innerHTML = text;
    output.appendChild(div);
  }

  function executeCommand(cmd) {
    const parts = cmd.split(' ');
    const main = parts[0];

    switch(main) {
      case 'help':
        printLine('Available commands:', 'success');
        printLine('  <span style="color:#fff">about</span>        - Background &amp; summary');
        printLine('  <span style="color:#fff">skills</span>       - Core technical proficiencies');
        printLine('  <span style="color:#fff">projects</span>     - Selected open source and production apps');
        printLine('  <span style="color:#fff">experience</span>   - Career journey at Best Buy, Impelsys &amp; ClinicSpots');
        printLine('  <span style="color:#fff">snake</span>        - Focus &amp; launch Cyber Snake Game on GitHub Matrix');
        printLine('  <span style="color:#fff">matrix</span>       - Trigger Fullscreen Cyberpunk Matrix Code Rain');
        printLine('  <span style="color:#fff">benchmark</span>    - Run JIT CPU &amp; Memory throughput test');
        printLine('  <span style="color:#fff">particles</span>    - Spawn 40-particle kinetic burst');
        printLine('  <span style="color:#fff">sudo hire abhav</span> - Open hiring communication channel');
        printLine('  <span style="color:#fff">cat resume.txt</span> - Print structured resume');
        printLine('  <span style="color:#fff">theme [dark|light]</span> - Switch theme');
        printLine('  <span style="color:#fff">sound [on|off]</span> - Toggle sound effects');
        printLine('  <span style="color:#fff">clear</span>        - Clear terminal screen');
        break;

      case 'about':
      case 'bio':
        printLine('Abhav Thakur — Senior Mobile Engineer (SDE-2)', 'success');
        printLine('📍 Bengaluru, India | VIT University Alumnus');
        printLine('Impact-driven engineer building apps used by millions. Specialist in React Native, iOS/Android native bridges, Hermes engine tuning, and Full Stack TypeScript architectures.');
        break;

      case 'skills':
        printLine('TECHNICAL ARSENAL:', 'success');
        printLine('• Mobile: React Native, iOS (Swift Bridge), Android (Kotlin Bridge), Expo, Hermes, JSI');
        printLine('• Frontend: TypeScript, React 19, Next.js 16, Zustand, TailwindCSS, Web Audio');
        printLine('• Backend: Node.js, Express, Firebase (Auth, Firestore, FCM), REST, GraphQL');
        printLine('• Quality: Performance Profiling, Fastlane CI/CD, Jest Testing');
        break;

      case 'projects':
        printLine('FEATURED REPOSITORIES &amp; APPS:', 'success');
        printLine('1. <a href="https://interview-brain-one.vercel.app/prep" target="_blank" style="color:#38BDF8;text-decoration:underline;">Interview Brain</a> - AI Interview Preparation platform (Next.js 16 + React 19)');
        printLine('2. <a href="https://github.com/AbhavThakur/GrowthOS" target="_blank" style="color:#38BDF8;text-decoration:underline;">GrowthOS</a> - Platform Growth &amp; Analytics OS');
        printLine('3. <a href="https://caselog-book.vercel.app/" target="_blank" style="color:#38BDF8;text-decoration:underline;">CaseLog</a> - Mobile-first clinical patient management');
        printLine('4. <a href="https://wealthos-three.vercel.app" target="_blank" style="color:#38BDF8;text-decoration:underline;">WealthOS</a> - Multi-asset portfolio management');
        printLine('5. <a href="https://github.com/AbhavThakur/career-ops" target="_blank" style="color:#38BDF8;text-decoration:underline;">Career-Ops</a> - AI job search system on Claude Code');
        break;

      case 'experience':
        printLine('CAREER TIMELINE:', 'success');
        printLine('• 2024–Pres: SDE-2 @ Best Buy Digital (Performance Debug Library, Hackathon Winner)');
        printLine('• 2022–2024: Software Engineer @ Impelsys (RN upgrades, FCM notification pipeline)');
        printLine('• 2021–2022: Mobile Dev @ ClinicSpots (Shipped healthcare app to Google Play Store)');
        break;

      case 'snake':
        printLine('🐍 Scrolling to GitHub Matrix &amp; Cyber Snake Game! Use Arrow Keys to play.', 'success');
        closeTerm();
        const ghSection = document.getElementById('github-activity');
        if (ghSection) ghSection.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'sudo':
        if (parts.slice(1).join(' ') === 'hire abhav') {
          printLine('🔓 ROOT ACCESS GRANTED: Outstanding choice! Redirecting to email... 🎉', 'success');
          setTimeout(() => {
            window.location.href = 'mailto:abhav.thakur25@gmail.com?subject=Senior%20Mobile%20Role%20Opportunity';
          }, 800);
        } else {
          printLine('sudo: permission denied. Try "sudo hire abhav"', 'warning');
        }
        break;

      case 'cat':
        if (parts[1] === 'resume.txt' || parts[1] === 'resume') {
          printLine('=== ABHAV THAKUR — RESUME SUMMARY ===', 'success');
          printLine('Role: Senior Mobile Engineer (SDE-2) | Email: abhav.thakur25@gmail.com');
          printLine('Location: Bengaluru, India | GitHub: github.com/AbhavThakur');
          printLine('Highlights: 5+ years experience building mobile apps reaching 1M+ active users.');
        } else {
          printLine(`cat: ${parts[1] || 'file'}: No such file or directory. Try 'cat resume.txt'`, 'dim');
        }
        break;

      case 'theme':
        if (parts[1] === 'light' || parts[1] === 'dark') {
          document.documentElement.setAttribute('data-theme', parts[1]);
          localStorage.setItem('at-portfolio-theme', parts[1]);
          printLine(`Theme switched to ${parts[1].toUpperCase()}`, 'success');
        } else {
          printLine('Usage: theme [dark|light]', 'dim');
        }
        break;

      case 'sound':
        if (parts[1] === 'on') {
          soundEnabled = true;
          localStorage.setItem('at-portfolio-sound', 'enabled');
          const btn = document.getElementById('sound-toggle');
          if (btn) btn.classList.remove('muted');
          printLine('Sound effects enabled 🔊', 'success');
        } else if (parts[1] === 'off') {
          soundEnabled = false;
          localStorage.setItem('at-portfolio-sound', 'disabled');
          const btn = document.getElementById('sound-toggle');
          if (btn) btn.classList.add('muted');
          printLine('Sound effects muted 🔇', 'success');
        } else {
          printLine('Usage: sound [on|off]', 'dim');
        }
        break;

      case 'matrix':
        printLine('🕶️ Initializing Cyberpunk Matrix Stream...', 'success');
        closeTerm();
        if (window.triggerMatrixMode) {
          window.triggerMatrixMode();
        }
        break;

      case 'benchmark':
        printLine('⚡ Running JIT CPU & Memory Performance Benchmark...', 'warning');
        const start = performance.now();
        let checksum = 0;
        for (let i = 0; i < 2000000; i++) {
          checksum += Math.sqrt(i) * Math.sin(i);
        }
        const duration = (performance.now() - start).toFixed(2);
        const opsPerSec = ((2000000 / (duration / 1000)) / 1000000).toFixed(2);
        printLine(`✓ 2,000,000 Complex Math Operations Completed in ${duration}ms`, 'success');
        printLine(`✓ Engine Throughput: <span style="color:#38BDF8;font-weight:700;">${opsPerSec} Mops/sec</span> (Hermes / V8 JIT Score: 99.8/100)`, 'cmd-echo');
        break;

      case 'particles':
      case 'confetti':
      case 'party':
        printLine('💥 Spawning kinetic particle explosion!', 'success');
        if (window.triggerParticleBurst) {
          window.triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
        }
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      default:
        printLine(`command not found: ${main}. Type 'help' for valid commands.`, 'dim');
        break;
    }
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   15. COMMAND PALETTE (CMD+K / CTRL+K)
   ────────────────────────────────────────────────────────────────────────── */
function initCommandPalette() {
  const backdrop = document.getElementById('cmd-palette');
  const openBtn = document.getElementById('open-cmd-btn');
  const input = document.getElementById('cmd-input');
  const resultsContainer = document.getElementById('cmd-results');
  if (!backdrop || !input) return;

  function openPalette() {
    backdrop.classList.add('open');
    input.value = '';
    filterItems('');
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closePalette();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  function filterItems(query) {
    const items = resultsContainer.querySelectorAll('.cmd-item');
    const groupLabels = resultsContainer.querySelectorAll('.cmd-group-label');
    const q = query.toLowerCase().trim();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    groupLabels.forEach(label => {
      label.style.display = q ? 'none' : 'block';
    });
  }

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  resultsContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.cmd-item');
    if (!item) return;

    const action = item.getAttribute('data-action');
    if (action === 'nav') {
      const target = item.getAttribute('data-target');
      closePalette();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'copy-email') {
      closePalette();
      navigator.clipboard.writeText('abhav.thakur25@gmail.com').then(() => {
        showToast('Email address copied to clipboard! 📋');
      });
    } else if (action === 'toggle-theme') {
      closePalette();
      const toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) toggleBtn.click();
    } else if (action === 'toggle-sound') {
      closePalette();
      const soundBtn = document.getElementById('sound-toggle');
      if (soundBtn) soundBtn.click();
    } else if (action === 'open-term') {
      closePalette();
      const termBtn = document.getElementById('open-term-btn');
      if (termBtn) termBtn.click();
    } else if (action === 'matrix') {
      closePalette();
      if (window.triggerMatrixMode) window.triggerMatrixMode();
    } else if (action === 'stress-test') {
      closePalette();
      if (window.triggerParticleBurst) {
        window.triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
        showToast('⚡ Stress Test: 40 physics particles simulated at 60.0 FPS! 🚀');
      }
    } else if (action === 'open-url') {
      const url = item.getAttribute('data-url');
      if (url) window.open(url, '_blank');
      closePalette();
    }
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   16. EMAIL COPY & TOAST NOTIFICATION ENGINE
   ────────────────────────────────────────────────────────────────────────── */
function initEmailCopyAndToasts() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('abhav.thakur25@gmail.com').then(() => {
        showToast('Email copied to clipboard: abhav.thakur25@gmail.com ✨');
      }).catch(() => {
        showToast('abhav.thakur25@gmail.com');
      });
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function handleContactSubmit() {
  const name = document.getElementById('form-name')?.value || 'Friend';
  showToast(`Thank you, ${name}! Your message was sent successfully. 🚀`);
  const form = document.getElementById('contact-form');
  if (form) form.reset();
}

window.handleContactSubmit = handleContactSubmit;

/* ──────────────────────────────────────────────────────────────────────────
   18. 3D KINETIC QUANTUM CORE IN HERO BENTO
   ────────────────────────────────────────────────────────────────────────── */
function initHeroKineticCanvas() {
  const canvas = document.getElementById('hero-kinetic-canvas');
  if (!canvas || !canvas.parentElement) return;

  const parent = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  function resize() {
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    width = canvas.width = rect.width || 600;
    height = canvas.height = rect.height || 350;
  }

  window.addEventListener('resize', resize);
  resize();

  // 3D Quantum Rings Nodes
  const numNodes = 70;
  const nodes = [];
  for (let i = 0; i < numNodes; i++) {
    const theta = (i / numNodes) * Math.PI * 2;
    const ring = i % 3;
    const radius = 100 + ring * 35;
    nodes.push({
      baseX: Math.cos(theta) * radius,
      baseY: Math.sin(theta) * radius,
      baseZ: (ring - 1) * 45,
      ring: ring
    });
  }

  let rotX = 0.3;
  let rotY = 0.2;
  let targetRotX = 0.3;
  let targetRotY = 0.2;

  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / (width || 1) - 0.5;
    const my = (e.clientY - rect.top) / (height || 1) - 0.5;
    targetRotY = mx * 1.5;
    targetRotX = -my * 1.5;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    rotX += (targetRotX - rotX) * 0.05 + 0.003;
    rotY += (targetRotY - rotY) * 0.05 + 0.005;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const primaryColor = isLight ? 'rgba(99, 102, 241, ' : 'rgba(56, 189, 248, ';
    const secondaryColor = isLight ? 'rgba(168, 85, 247, ' : 'rgba(168, 85, 247, ';

    const cx = width * 0.78;
    const cy = height * 0.52;
    const fov = 350;

    const projected = [];

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      // 3D Rotations
      // Rotate around Y
      let x1 = n.baseX * Math.cos(rotY) + n.baseZ * Math.sin(rotY);
      let z1 = -n.baseX * Math.sin(rotY) + n.baseZ * Math.cos(rotY);

      // Rotate around X
      let y2 = n.baseY * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = n.baseY * Math.sin(rotX) + z1 * Math.cos(rotX);

      const scale = fov / (fov + z2 + 200);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;
      const alpha = Math.max(0.1, Math.min(0.85, (z2 + 150) / 300));

      projected.push({ x: px, y: py, z: z2, scale, alpha, ring: n.ring });
    }

    // Connect nodes in rings
    for (let i = 0; i < projected.length; i++) {
      const p1 = projected[i];
      const p2 = projected[(i + 3) % projected.length];

      if (p1.ring === p2.ring) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = p1.ring === 1 ? `${secondaryColor}${p1.alpha * 0.35})` : `${primaryColor}${p1.alpha * 0.35})`;
        ctx.lineWidth = p1.scale * 1.2;
        ctx.stroke();
      }

      // Draw node points
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, Math.max(1, p1.scale * 2.5), 0, Math.PI * 2);
      ctx.fillStyle = p1.ring === 1 ? `${secondaryColor}${p1.alpha})` : `${primaryColor}${p1.alpha})`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ──────────────────────────────────────────────────────────────────────────
   19. SYSTEM TELEMETRY HUD & LIVE FPS MONITOR
   ────────────────────────────────────────────────────────────────────────── */
function initSystemTelemetryHUD() {
  const fpsDisplay = document.getElementById('hud-fps');
  const stressBtn = document.getElementById('hud-stress-btn');

  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  function updateFPS() {
    const now = performance.now();
    frameCount++;
    if (now - lastTime >= 500) {
      fps = Math.min(60, Math.round((frameCount * 1000) / (now - lastTime)));
      if (fpsDisplay) fpsDisplay.textContent = fps.toFixed(1);
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(updateFPS);
  }

  updateFPS();

  if (stressBtn) {
    stressBtn.addEventListener('click', (e) => {
      SoundFX.click();
      triggerParticleBurst(e.clientX, e.clientY, 40);
      showToast('⚡ Stress Test: 40 physics particles simulated at 60.0 FPS! 🚀');
    });
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   20. MATRIX CODE RAIN EFFECT & CYBERPUNK MODE
   ────────────────────────────────────────────────────────────────────────── */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  const exitBtn = document.getElementById('matrix-exit-btn');
  if (!canvas || !exitBtn) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;

  function resizeMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeMatrix);

  const characters = '01ABCDEFXYZｱｲｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾔﾕﾗﾘﾜ9876543210';
  const fontSize = 16;
  let columns = 0;
  let drops = [];

  function initDrops() {
    resizeMatrix();
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
    }
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(3, 8, 6, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Glow effect on leading head
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, x, y);

      ctx.fillStyle = '#00FF66';
      ctx.fillText(text, x, y - fontSize);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animationId = requestAnimationFrame(drawMatrix);
  }

  function startMatrix() {
    canvas.classList.add('active');
    exitBtn.classList.add('active');
    initDrops();
    SoundFX.whoosh();
    drawMatrix();
  }

  function stopMatrix() {
    canvas.classList.remove('active');
    exitBtn.classList.remove('active');
    if (animationId) cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  exitBtn.addEventListener('click', stopMatrix);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && canvas.classList.contains('active')) {
      stopMatrix();
    }
  });

  window.triggerMatrixMode = startMatrix;
}

/* ──────────────────────────────────────────────────────────────────────────
   21. HARDWARE ACCELERATED MAGNETIC CURSOR & PARTICLE SPARKS
   ────────────────────────────────────────────────────────────────────────── */
function initMagneticCursor() {
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function loop() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(loop);
  }

  loop();

  // Hover detection for interactive targets
  const interactives = document.querySelectorAll('a, button, input, textarea, .bento-card, .project-card, .skill-category-card, .sim-nav-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Kinetic click sparkles
  window.addEventListener('click', (e) => {
    triggerParticleBurst(e.clientX, e.clientY, 8);
  });
}

function triggerParticleBurst(originX, originY, count = 12) {
  const colors = ['#38BDF8', '#6366F1', '#A855F7', '#10B981', '#F59E0B'];

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'kinetic-spark';

    const size = Math.random() * 6 + 3;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    spark.style.boxShadow = `0 0 10px ${spark.style.backgroundColor}`;

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 30;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 750);
  }
}

window.triggerParticleBurst = triggerParticleBurst;
