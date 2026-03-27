/* =========================================================
   ECE CONNECT — script.js
   Handles: navbar, modal, registration, counter, toast
   ========================================================= */

// ── Navbar: scroll shadow + active link ──────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Add shadow when scrolled
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Highlight active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ── Hamburger (mobile nav) ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  // Animate hamburger bars
  hamburger.classList.toggle('active');
});

// Close mobile nav on link click
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
  });
});

// ── Smooth scroll helper ─────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile menu if open
    navLinksContainer.classList.remove('open');
  }
}

// ── Modal: Login ─────────────────────────────────────────
const modals = { login: document.getElementById('loginModal') };

function showModal(type) {
  if (modals[type]) {
    modals[type].classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(type) {
  if (modals[type]) {
    modals[type].classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking backdrop
function closeModalOutside(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    Object.keys(modals).forEach(type => closeModal(type));
  }
});

// ── Toast notification ────────────────────────────────────
let toastTimer = null;

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  // Clear any previous timer
  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ── Registration Form ─────────────────────────────────────
function handleRegister(event) {
  event.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const year     = document.getElementById('year').value;
  const section  = document.getElementById('section').value.trim();
  const skills   = document.getElementById('skills').value.trim();

  // Basic validation
  if (!name || !email || !password || !year || !section) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }
  if (password.length < 8) {
    showToast('⚠️ Password must be at least 8 characters.');
    return;
  }

  // Simulate successful registration
  showToast(`🎉 Welcome to ECE Connect, ${name}! Account created successfully.`, 4000);

  // Reset form
  event.target.reset();
}

// ── Login Form ────────────────────────────────────────────
function handleLogin(event) {
  event.preventDefault();
  showToast('✅ Logged in successfully! Welcome back.', 3500);
  closeModal('login');
  event.target.reset();
}

// ── Password Toggle ───────────────────────────────────────
function togglePassword() {
  const pwInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  if (pwInput.type === 'password') {
    pwInput.type = 'text';
    eyeIcon.className = 'ri-eye-off-line';
  } else {
    pwInput.type = 'password';
    eyeIcon.className = 'ri-eye-line';
  }
}

// ── Join Project ──────────────────────────────────────────
function joinProject(btn) {
  const card  = btn.closest('.project-card');
  const title = card.querySelector('.proj-title').textContent;

  // Toggle state
  if (btn.classList.contains('joined')) {
    btn.innerHTML = '<i class="ri-user-add-line"></i> Join Project';
    btn.classList.remove('joined');
    btn.style.background = '';
    btn.style.borderColor = '';
    showToast(`Left project: ${title}`);
  } else {
    btn.innerHTML = '<i class="ri-check-line"></i> Joined!';
    btn.classList.add('joined');
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    showToast(`🚀 You joined: ${title}`);
  }
}

// ── Join Study Group ──────────────────────────────────────
function joinGroup(btn) {
  const card    = btn.closest('.group-card');
  const subject = card.querySelector('h3').textContent;

  if (btn.classList.contains('joined')) {
    btn.innerHTML = '<i class="ri-team-line"></i> Join Group';
    btn.classList.remove('joined');
    btn.style.background = '';
    btn.style.color = '';
    showToast(`Left study group: ${subject}`);
  } else {
    btn.innerHTML = '<i class="ri-check-line"></i> Joined!';
    btn.classList.add('joined');
    btn.style.background = 'var(--blue)';
    btn.style.color = '#fff';
    showToast(`📚 Joined study group: ${subject}`);
  }
}

// ── Animated Counter ──────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1800; // ms
    const step = target / (duration / 16); // ~60fps
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    update();
  });
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect(); // Only run once
    }
  });
}, { threshold: 0.3 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ── Scroll-reveal animation for cards ─────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger reveal
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Apply to cards
document.querySelectorAll(
  '.feature-card, .project-card, .group-card, .student-card, .event-item'
).forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity .55s ease, transform .55s ease, border-color .25s, box-shadow .25s';
  revealObserver.observe(card);
});

// ── Active nav link click handler ─────────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Init ──────────────────────────────────────────────────
console.log('%c⚡ ECE Connect', 'color:#2563eb;font-size:1.2rem;font-weight:bold');
console.log('%cPVP Siddhartha Institute · ECE Department', 'color:#64748b');
