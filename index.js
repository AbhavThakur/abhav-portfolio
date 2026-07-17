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
