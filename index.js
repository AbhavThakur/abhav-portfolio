/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO INTERACTIONS — Playful & Premium
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
  initMagneticButtons();
  initParticleBurst();
  initParallaxScroll();
  initFloatingShapes();
});

/* ──────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL (Re-triggerable Bouncy Animations)
   ────────────────────────────────────────────────────────────────────────── */
function initScrollReveal() {

  // ── Project Cards: Staggered flip-up with bounce ──
  const projectCards = document.querySelectorAll('.project-card');
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        const cards = Array.from(el.parentElement.querySelectorAll('.project-card'));
        const i = cards.indexOf(el);
        const fromLeft = i % 2 === 0;
        const delay = i * 150;

        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = `translateX(${fromLeft ? '-80px' : '80px'}) translateY(50px) scale(0.8) rotate(${fromLeft ? '-3' : '3'}deg)`;

        requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.transition = 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0) translateY(0) scale(1) rotate(0deg)';
          }, delay);
        });
      } else {
        // Reset when out of view so animation replays
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.8)';
      }
    });
  }, { threshold: 0.15 });

  projectCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.8)';
    projectObserver.observe(card);
  });

  // ── Timeline Items: Cascading slide + pop ──
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        const items = Array.from(el.parentElement.querySelectorAll('.timeline-item'));
        const i = items.indexOf(el);
        const delay = i * 250;

        // Main container
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateX(-40px)';

        // Node pop
        const node = el.querySelector('.timeline-node');
        if (node) {
          node.style.transition = 'none';
          node.style.transform = 'scale(0)';
        }

        // Content card
        const content = el.querySelector('.timeline-content');
        if (content) {
          content.style.transition = 'none';
          content.style.opacity = '0';
          content.style.transform = 'translateY(30px) scale(0.92)';
        }

        requestAnimationFrame(() => {
          // 1. Slide the whole item in
          setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          }, delay);

          // 2. Pop the node
          if (node) {
            setTimeout(() => {
              node.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
              node.style.transform = 'scale(1)';
            }, delay + 200);
          }

          // 3. Bounce the content card up
          if (content) {
            setTimeout(() => {
              content.style.transition = 'opacity 0.6s ease-out, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)';
              content.style.opacity = '1';
              content.style.transform = 'translateY(0) scale(1)';
            }, delay + 300);
          }
        });
      } else {
        // Reset for replay
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = 'translateX(-40px)';
        const node = el.querySelector('.timeline-node');
        if (node) { node.style.transition = 'none'; node.style.transform = 'scale(0)'; }
        const content = el.querySelector('.timeline-content');
        if (content) { content.style.transition = 'none'; content.style.opacity = '0'; content.style.transform = 'translateY(30px) scale(0.92)'; }
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-40px)';
    // Remove the .reveal class so it doesn't fight with our JS animations
    item.classList.remove('reveal');
    timelineObserver.observe(item);
  });

  // ── Timeline Line: Draw itself ──
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-visible');
        } else {
          entry.target.classList.remove('line-visible');
        }
      });
    }, { threshold: 0.1 });
    lineObserver.observe(timelineContainer);
  }

  // ── Generic .reveal elements (bento cards, section headers) ──
  const genericReveals = document.querySelectorAll('.reveal:not(.project-card):not(.timeline-item)');
  const genericObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 100}ms`;
        }
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  genericReveals.forEach((el) => genericObserver.observe(el));

  // ── Section Title: Bouncy scale-in ──
  document.querySelectorAll('.section-title').forEach((title) => {
    const titleObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate([
            { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
            { opacity: 1, transform: 'translateY(-8px) scale(1.03)', offset: 0.6 },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ], {
            duration: 800,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'forwards',
          });
          titleObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    titleObs.observe(title);
  });
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
   MAGNETIC HOVER BUTTONS
   ────────────────────────────────────────────────────────────────────────── */
function initMagneticButtons() {
  const magnets = document.querySelectorAll('[data-magnetic]');

  magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   PARTICLE CLICK BURST (CONFETTI)
   ────────────────────────────────────────────────────────────────────────── */
function initParticleBurst() {
  const colors = ['#FF7E67', '#4ade80', '#A78BFA', '#60A5FA', '#FCD34D'];
  const shapes = ['circle', 'square', 'triangle'];

  document.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    for (let i = 0; i < 16; i++) {
      createParticle(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)], shapes[Math.floor(Math.random() * shapes.length)]);
    }
  });

  function createParticle(x, y, color, shape) {
    const particle = document.createElement('div');
    particle.className = 'click-particle';
    particle.style.backgroundColor = color;
    
    if (shape === 'square') {
      particle.style.borderRadius = '2px';
    } else if (shape === 'triangle') {
      particle.style.backgroundColor = 'transparent';
      particle.style.borderLeft = `${Math.random() * 4 + 3}px solid transparent`;
      particle.style.borderRight = `${Math.random() * 4 + 3}px solid transparent`;
      particle.style.borderBottom = `${Math.random() * 8 + 6}px solid ${color}`;
    }
    
    document.body.appendChild(particle);

    const size = Math.random() * 10 + 4;
    if (shape !== 'triangle') {
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
    }
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 50;
    const destinationX = x + Math.cos(angle) * velocity;
    const destinationY = y + Math.sin(angle) * velocity - 30; // slight upward bias
    const rotation = Math.random() * 720 - 360;
    
    particle.animate([
      { 
        transform: `translate(${x}px, ${y}px) rotate(0deg) scale(1)`,
        opacity: 1 
      },
      { 
        transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg) scale(0)`,
        opacity: 0 
      }
    ], {
      duration: Math.random() * 600 + 400,
      easing: 'cubic-bezier(0, .9, .57, 1)'
    }).onfinish = () => particle.remove();
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   SUBTLE PARALLAX SCROLLING
   ────────────────────────────────────────────────────────────────────────── */
function initParallaxScroll() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach((el) => {
      const speed = el.getAttribute('data-parallax') || 0.1;
      const yPos = -(scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   FLOATING GEOMETRIC SHAPES (Background Ambiance)
   ────────────────────────────────────────────────────────────────────────── */
function initFloatingShapes() {
  const container = document.createElement('div');
  container.className = 'floating-shapes';
  document.body.prepend(container);

  const colors = ['rgba(255,126,103,0.12)', 'rgba(167,139,250,0.12)', 'rgba(96,165,250,0.12)', 'rgba(74,222,128,0.12)', 'rgba(252,211,77,0.12)'];

  for (let i = 0; i < 6; i++) {
    const shape = document.createElement('div');
    shape.className = 'floating-shape';
    
    const size = Math.random() * 80 + 40;
    const isCircle = Math.random() > 0.5;
    
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.borderRadius = isCircle ? '50%' : `${Math.random() * 30 + 10}px`;
    shape.style.background = colors[i % colors.length];
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;
    shape.style.animationDuration = `${Math.random() * 15 + 15}s`;
    shape.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(shape);
  }
}
