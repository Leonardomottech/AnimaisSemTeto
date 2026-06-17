// -----------------------------------------------
// HEADER: adiciona classe "scrolled" ao rolar
// -----------------------------------------------
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// -----------------------------------------------
// MOBILE NAV
// -----------------------------------------------
const hamburger    = document.getElementById('hamburger');
const mobileNav    = document.getElementById('mobileNav');
const mobileClose  = document.getElementById('mobileNavClose');
const mobileLinks  = mobileNav.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileClose.focus();
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus();
}

mobileClose.addEventListener('click', closeMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMobileNav();
});

// -----------------------------------------------
// FADE-IN on scroll (Intersection Observer)
// -----------------------------------------------
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger: children within same parent get delay
      const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
      let delay = 0;
      siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 120; });
      entry.target.style.transitionDelay = delay + 'ms';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// -----------------------------------------------
// COUNTER ANIMATION (hero stats)
// -----------------------------------------------
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('pt-BR') + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsSection = document.getElementById('inicio');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = target === 6 ? '' : '';
      animateCounter(el, target, suffix);
    });
  }
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// -----------------------------------------------
// DOAÇÃO: selecionar valor
// -----------------------------------------------
const doeBtn = document.querySelector('.doe-confirm');
const amountButtons = document.querySelectorAll('.doe-amount');

function selectAmount(btn, value) {
  amountButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (value === 'outro') {
    doeBtn.textContent = '❤️ Informar meu valor';
  } else {
    doeBtn.textContent = `❤️ Confirmar Doação de R$ ${value}`;
  }
}

amountButtons.forEach(btn => {
  btn.addEventListener('click', () => selectAmount(btn, btn.dataset.amount));
});

// -----------------------------------------------
// FORMULÁRIO DE CONTATO
// -----------------------------------------------
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('assunto').value;
  const msg     = document.getElementById('mensagem').value.trim();

  if (!name || !email || !subject || !msg) {
    showToast('⚠️ Por favor, preencha todos os campos obrigatórios.', '#E8712A');
    return;
  }

  if (!isValidEmail(email)) {
    showToast('⚠️ Por favor, insira um e-mail válido.', '#E8712A');
    return;
  }

  // Simula envio
  const submitBtn = form.querySelector('.form-submit');
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    submitBtn.textContent = '❤️ Enviar Mensagem';
    submitBtn.disabled = false;
    showToast('✅ Mensagem enviada! Entraremos em contato em breve.', '#3D7A5E');
  }, 1500);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -----------------------------------------------
// TOAST NOTIFICATION
// -----------------------------------------------
function showToast(msg, bg = '#3D7A5E') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = bg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// -----------------------------------------------
// ACTIVE NAV LINK on scroll
// -----------------------------------------------
const sections   = document.querySelectorAll('section[id], .doe-banner[id]');
const navLinks   = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });
