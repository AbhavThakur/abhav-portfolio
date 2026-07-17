/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO INTERACTIONS (Refined Premium Animations)
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
  initMagneticButtons();
  initParticleBurst();
  initParallaxScroll();
});

/* ──────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL (Enhanced with Staggered Bouncy Animations)
   ────────────────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const parent = el.parentElement;

          // Calculate stagger delay based on sibling index
          let staggerDelay = 0;
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const index = siblings.indexOf(el);
            staggerDelay = index * 120; // 120ms between each sibling
          }

          // Project cards: scale up + slide from alternating sides
          if (el.classList.contains('project-card')) {
            const siblings = Array.from(parent.querySelectorAll('.project-card'));
            const index = siblings.indexOf(el);
            const fromLeft = index % 2 === 0;

            el.animate([
              {
                opacity: 0,
                transform: `translateX(${fromLeft ? '-60px' : '60px'}) translateY(40px) scale(0.85)`,
              },
              {
                opacity: 1,
                transform: 'translateX(0) translateY(0) scale(1.02)',
                offset: 0.7,
              },
              {
                opacity: 1,
                transform: 'translateX(0) translateY(0) scale(1)',
              }
            ], {
              duration: 800,
              delay: staggerDelay,
              easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy overshoot
              fill: 'forwards',
            });

            el.style.opacity = '0'; // Hide until animation starts
            setTimeout(() => { el.style.opacity = ''; }, staggerDelay);
          }
          // Timeline items: slide from left with elastic bounce
          else if (el.classList.contains('timeline-item')) {
            const siblings = Array.from(parent.querySelectorAll('.timeline-item'));
            const index = siblings.indexOf(el);
            const itemDelay = index * 200;

            // Animate the node (the dot) with a pop
            const node = el.querySelector('.timeline-node');
            if (node) {
              node.animate([
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'scale(1.5)', opacity: 1, offset: 0.6 },
                { transform: 'scale(1)', opacity: 1 },
              ], {
                duration: 500,
                delay: itemDelay,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                fill: 'forwards',
              });
              node.style.opacity = '0';
            }

            // Animate the date label
            const dateLbl = el.querySelector('.timeline-date');
            if (dateLbl) {
              dateLbl.animate([
                { opacity: 0, transform: 'translateX(-30px)' },
                { opacity: 1, transform: 'translateX(0)' },
              ], {
                duration: 600,
                delay: itemDelay + 100,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                fill: 'forwards',
              });
              dateLbl.style.opacity = '0';
            }

            // Animate the content card: slide up + scale with bounce
            const content = el.querySelector('.timeline-content');
            if (content) {
              content.animate([
                { opacity: 0, transform: 'translateY(50px) scale(0.9)' },
                { opacity: 1, transform: 'translateY(-5px) scale(1.01)', offset: 0.7 },
                { opacity: 1, transform: 'translateY(0) scale(1)' },
              ], {
                duration: 700,
                delay: itemDelay + 200,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                fill: 'forwards',
              });
              content.style.opacity = '0';
            }
          }
          // Default: simple fade up (for section headers, bento cards, etc.)
          else {
            el.style.transitionDelay = `${staggerDelay}ms`;
            el.classList.add('visible');
          }

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  reveals.forEach((el) => observer.observe(el));

  // Timeline line grow animation
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('line-visible');
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    lineObserver.observe(timelineContainer);
  }

  // Section title bounce animation
  document.querySelectorAll('.section-title').forEach((title) => {
    const titleObserver = new IntersectionObserver(
      (entries) => {
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
            titleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    titleObserver.observe(title);
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
      
      // The pull strength (0.3 is subtle, 0.5 is strong)
      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      // Reset position
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   PARTICLE CLICK BURST (CONFETTI)
   ────────────────────────────────────────────────────────────────────────── */
function initParticleBurst() {
  const colors = ['#FF7E67', '#4ade80', '#A78BFA', '#60A5FA', '#FCD34D'];

  document.addEventListener('click', (e) => {
    // Don't spawn burst if clicking on a link to avoid weird glitches during navigation
    if (e.target.closest('a') || e.target.closest('button')) return;
    
    for (let i = 0; i < 12; i++) {
      createParticle(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)]);
    }
  });

  function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.className = 'click-particle';
    particle.style.backgroundColor = color;
    
    document.body.appendChild(particle);

    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    const destinationX = x + (Math.random() - 0.5) * 100;
    const destinationY = y + (Math.random() - 0.5) * 100;
    const rotation = Math.random() * 360;
    
    particle.animate([
      { 
        transform: `translate(${x}px, ${y}px) rotate(0deg)`,
        opacity: 1 
      },
      { 
        transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`,
        opacity: 0 
      }
    ], {
      duration: Math.random() * 500 + 500,
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
