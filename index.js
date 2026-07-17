/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO INTERACTIONS (Refined Premium Animations)
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
  initSpotlightEffect();
  initCustomCursor();
  initParticleBackground();
});

/* ──────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL (Intersection Observer)
   ────────────────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          if (parent && (parent.classList.contains('bento-grid') || parent.classList.contains('projects-grid') || parent.classList.contains('experience-list'))) {
            const siblings = parent.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sibling) => {
              if (sibling === entry.target) {
                entry.target.style.transitionDelay = `${delay * 0.08}s`;
              }
              delay++;
            });
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────────────────────
   COUNTER ANIMATION
   ────────────────────────────────────────────────────────────────────────── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ──────────────────────────────────────────────────────────────────────────
   SMOOTH SCROLL
   ────────────────────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   SPOTLIGHT EFFECT
   ────────────────────────────────────────────────────────────────────────── */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.bento-card, .project-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   CUSTOM CURSOR (Hollow outline + Dot cursor)
   ────────────────────────────────────────────────────────────────────────── */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    // Show cursor on first movement
    dot.style.opacity = '1';
    outline.style.opacity = '1';
  });

  // Smooth lerping loop for cursor outline
  function updateCursor() {
    // Inner dot follows mouse closely
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    // Outer circle trails behind
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;

    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Hover states expansion
  const hoverables = document.querySelectorAll('.cursor-hover, a, button, .bento-card, .project-card, .btn');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovered');
      outline.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovered');
      outline.classList.remove('hovered');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   INTERACTIVE CONNECTING PARTICLES BACKGROUND
   ────────────────────────────────────────────────────────────────────────── */
function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let mouse = {
    x: null,
    y: null,
    radius: 130
  };

  // Adjust canvas size to window screen
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Mouse leave listener
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off screen limits
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse collision/repulsion
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Push particles away from cursor
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 3;
          let directionY = forceDirectionY * force * 3;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;

      this.draw();
    }
  }

  // Populate particles array
  function initParticles() {
    particlesArray = [];
    // Adapt particle count to resolution
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap at 120 for performance

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1; // 1px to 3px
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2; // Slow speed
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = 'rgba(255, 255, 255, 0.15)'; // Very faint white

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw lines connecting particles
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 90) {
          opacityValue = 1 - (distance / 90);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.08})`; // Faint grey lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // Resize rebuild
  window.addEventListener('resize', () => {
    initParticles();
  });
}
