/* =========================================================
   ECE CONNECT — script.js
   Handles: navbar, modal, registration, counter, toast
   ========================================================= */

// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC9fNVtOrR_VKUNXFXhiG8PJzs_JyXMVRQ",
  authDomain: "ece-connect-d2df7.firebaseapp.com",
  projectId: "ece-connect-d2df7",
  storageBucket: "ece-connect-d2df7.appspot.com",
  messagingSenderId: "1093595103388",
  appId: "1:1093595103388:web:ff0ef47a46f9254c7c2d59"
};


// 🔥 INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



/* =========================================================
   WEBSITE FUNCTIONALITY (Your original code)
   ========================================================= */

// ── Navbar ─────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

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


// ── Hamburger ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
  });
});


// ── Smooth Scroll ──────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    navLinksContainer.classList.remove('open');
  }
}


// ── Modal ──────────────────────────────────
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

function closeModalOutside(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.classList.remove('active');
    document.body.style.overflow = '';
  }
}


// ── Toast ──────────────────────────────────
let toastTimer = null;

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}



/* =========================================================
   🔐 REGISTRATION WITH FIREBASE
   ========================================================= */

async function handleRegister(event) {

  event.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const year     = document.getElementById('year').value;
  const section  = document.getElementById('section').value.trim();
  const skills   = document.getElementById('skills').value.trim();

  if (!name || !email || !password || !year || !section) {
    showToast("⚠️ Please fill all required fields.");
    return;
  }

  try {

    // 🔥 Create account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // 🔥 Save profile in Firestore
    await addDoc(collection(db, "students"), {
      name: name,
      email: email,
      year: year,
      section: section,
      skills: skills
    });

    showToast(`🎉 Welcome ${name}! Account created.` , 4000);

    event.target.reset();

  } catch (error) {
    showToast("❌ " + error.message);
  }

}



/* =========================================================
   🔐 LOGIN WITH FIREBASE
   ========================================================= */

async function handleLogin(event) {

  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    showToast("✅ Logged in successfully!", 3500);
    closeModal("login");

    event.target.reset();

  } catch (error) {

    showToast("❌ " + error.message);

  }

}



/* =========================================================
   PASSWORD TOGGLE
   ========================================================= */

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



/* =========================================================
   JOIN PROJECT
   ========================================================= */

function joinProject(btn) {

  const card  = btn.closest('.project-card');
  const title = card.querySelector('.proj-title').textContent;

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



/* =========================================================
   JOIN STUDY GROUP
   ========================================================= */

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



/* =========================================================
   CONSOLE INIT
   ========================================================= */

console.log('%c⚡ ECE Connect', 'color:#2563eb;font-size:1.2rem;font-weight:bold');
console.log('%cPVP Siddhartha Institute · ECE Department', 'color:#64748b');
