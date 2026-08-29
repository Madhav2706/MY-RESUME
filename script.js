document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

function closeMenu() {
  sidebar.classList.remove('open');
  menuToggle.classList.remove('open');
  scrim.classList.remove('visible');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  const isOpen = sidebar.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  scrim.classList.toggle('visible', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}

menuToggle.addEventListener('click', toggleMenu);
scrim.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(section => spyObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = percent + '%';
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const submitBtn = form.querySelector('.submit-btn');
const btnText = form.querySelector('.btn-text');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (form.action.includes('YOUR_FORM_ID')) {
    status.textContent = 'Form not connected yet — add your Formspree form ID in index.html.';
    status.className = 'form-status error';
    return;
  }

  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  status.textContent = '';
  status.className = 'form-status';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.textContent = "Message sent — thanks for reaching out! I'll get back to you soon.";
      status.className = 'form-status success';
      form.reset();
    } else {
      status.textContent = 'Something went wrong. Please try again or email me directly.';
      status.className = 'form-status error';
    }
  } catch (err) {
    status.textContent = 'Network error. Please try again or email me directly.';
    status.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
  }
});