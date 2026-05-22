/* ============================================================
   PORTFOLIO SCRIPT
   Handles: Loader, Navbar, Typed text, Particles,
   Scroll reveal, Skill animations, Counters,
   Project filters, Lightbox modal, Contact form,
   Back-to-top, Theme toggle
============================================================ */

'use strict';

/* ──────────────────────────────────────────
   1. LOADER
────────────────────────────────────────── */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  // Give the loader bar time to finish, then fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger initial hero reveal after loader
    triggerInitialReveal();
  }, 2000);
});

// Prevent scroll during loading
document.body.style.overflow = 'hidden';

/* ──────────────────────────────────────────
   2. NAVBAR — scroll style + active link
────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

// Scroll: add .scrolled class
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  // Navbar style
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // Active nav link (based on section visibility)
  let current = '';
  document.querySelectorAll('section[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  // Back-to-top button
  backTop.classList.toggle('visible', window.scrollY > 400);

  // Scroll reveal
  revealElements();

  // Skill animations trigger
  animateSkillsIfVisible();
}

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ──────────────────────────────────────────
   3. TYPED TEXT ANIMATION
────────────────────────────────────────── */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'build embedded systems.',
  'write clean code.',
  'design PCB circuits.',
  'create web apps.',
  'love networking.',
  'solve hard problems.',
];
let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let typingPaused = false;

function typeWriter() {
  if (typingPaused) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex--);
  } else {
    typedEl.textContent = current.substring(0, charIndex++);
  }

  let delay = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex > current.length) {
    isDeleting = true;
    delay = 1600; // pause at end
  } else if (isDeleting && charIndex < 0) {
    isDeleting   = false;
    phraseIndex  = (phraseIndex + 1) % phrases.length;
    charIndex    = 0;
    delay        = 400;
  }

  setTimeout(typeWriter, delay);
}

// Start after loader
setTimeout(typeWriter, 2200);

/* ──────────────────────────────────────────
   4. PARTICLES BACKGROUND
────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + 0.4;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = (Math.random() - 0.5) * 0.3;
    this.life = Math.random();
    this.dl   = (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
  };
  Particle.prototype.update = function () {
    this.x    += this.vx;
    this.y    += this.vy;
    this.life += this.dl;
    if (this.life <= 0 || this.life >= 1) this.dl *= -1;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    resize();
    const count = Math.floor((W * H) / 14000);
    particles   = Array.from({ length: count }, () => new Particle());
  }

  const CONNECT_DIST = 130;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.strokeStyle = `rgba(57,208,255,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(57,208,255,${p.life * 0.6})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { init(); });
})();

/* ──────────────────────────────────────────
   5. SCROLL REVEAL
────────────────────────────────────────── */
function revealElements() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('revealed');
    }
  });
}

function triggerInitialReveal() {
  revealElements();
}

// Also run on load (for elements already in view)
revealElements();

/* ──────────────────────────────────────────
   6. ANIMATED COUNTERS
────────────────────────────────────────── */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const about = document.getElementById('about');
  if (!about) return;
  const rect = about.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    countersStarted = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let count = 0;
      const duration = 1400;
      const step     = Math.ceil(duration / target);
      const timer    = setInterval(() => {
        count += 1;
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, step);
    });
  }
}

// Hook into scroll
const _origOnScroll = onScroll;
window.addEventListener('scroll', startCounters, { passive: true });
startCounters(); // check on load

/* ──────────────────────────────────────────
   7. SKILL BAR & CIRCULAR ANIMATIONS
────────────────────────────────────────── */
let skillsAnimated = false;

// Inject SVG gradient definitions once
(function injectSvgDefs() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg   = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.setAttribute('id', 'circGrad');
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '0%');
  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#39d0ff');
  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#a855f7');
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);
  document.body.appendChild(svg);
})();

function animateSkillsIfVisible() {
  if (skillsAnimated) return;
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    skillsAnimated = true;

    // Progress bars
    document.querySelectorAll('.skill-bar-item').forEach((item, i) => {
      const level = item.dataset.level;
      const fill  = item.querySelector('.skill-fill');
      setTimeout(() => {
        fill.style.width = level + '%';
      }, i * 120);
    });

    // Circular indicators
    const circumference = 2 * Math.PI * 42; // r=42
    document.querySelectorAll('.circ-fg').forEach((circle, i) => {
      const pct    = parseFloat(circle.dataset.pct) / 100;
      const offset = circumference * (1 - pct);
      setTimeout(() => {
        circle.style.strokeDashoffset = offset;
      }, i * 180 + 200);
    });
  }
}

// Also check on load
window.addEventListener('load', animateSkillsIfVisible);

/* ──────────────────────────────────────────
   8. PROJECT FILTER
────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ──────────────────────────────────────────
   9. PROJECT LIGHTBOX MODAL
────────────────────────────────────────── */
const modal       = document.getElementById('project-modal');
const modalImg    = document.getElementById('modal-img');
const modalTitle  = document.getElementById('modal-title');
const modalDesc   = document.getElementById('modal-desc');
const modalTech   = document.getElementById('modal-tech');
const modalLink   = document.getElementById('modal-link');
const modalClose  = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalVideo = document.getElementById('modal-video');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent  = card.dataset.desc;
    modalTech.textContent  = card.dataset.tech;

    // Show video iframe OR image depending on data-video
    if (card.dataset.video) {
      modalVideo.src          = card.dataset.video;
      modalVideo.style.display = 'block';
      modalImg.style.display   = 'none';
    } else {
      modalImg.src             = card.dataset.img;
      modalImg.alt             = card.dataset.title;
      modalImg.style.display   = 'block';
      modalVideo.style.display = 'none';
      modalVideo.src           = ''; // clear any previous video
    }

    // Show or hide GitHub button
    if (card.dataset.link) {
      modalLink.href           = card.dataset.link;
      modalLink.style.display  = 'inline-flex';
    } else {
      modalLink.style.display  = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  modalVideo.src = ''; // stops the video from playing in background
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ──────────────────────────────────────────
   10. CONTACT FORM VALIDATION
────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('invalid');
  error.textContent = message;
}
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('invalid');
  error.textContent = '';
}

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  // Name validation
  const name = document.getElementById('form-name').value.trim();
  if (!name) {
    showError('form-name', 'err-name', 'Name is required.');
    valid = false;
  } else if (name.length < 2) {
    showError('form-name', 'err-name', 'Name must be at least 2 characters.');
    valid = false;
  } else {
    clearError('form-name', 'err-name');
  }

  // Email validation
  const email = document.getElementById('form-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('form-email', 'err-email', 'Email is required.');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('form-email', 'err-email', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('form-email', 'err-email');
  }

  // Message validation
  const message = document.getElementById('form-message').value.trim();
  if (!message) {
    showError('form-message', 'err-message', 'Message is required.');
    valid = false;
  } else if (message.length < 15) {
    showError('form-message', 'err-message', 'Message must be at least 15 characters.');
    valid = false;
  } else {
    clearError('form-message', 'err-message');
  }

  if (valid) {
    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        contactForm.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    })
    .catch(() => alert('Network error. Please try again.'))
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
  }
});

// Clear errors on input
['form-name', 'form-email', 'form-message'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    this.classList.remove('invalid');
  });
});

/* ──────────────────────────────────────────
   11. BACK TO TOP
────────────────────────────────────────── */
const backTop = document.getElementById('back-top');
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────
   12. THEME TOGGLE
────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');

// Restore saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeIcon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

/* ──────────────────────────────────────────
   13. FOOTER YEAR
────────────────────────────────────────── */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/* ──────────────────────────────────────────
   14. SMOOTH SCROLL for anchor links
────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ──────────────────────────────────────────
   INIT — run scroll handlers on load
────────────────────────────────────────── */
window.addEventListener('scroll', onScroll, { passive: true });
