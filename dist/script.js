const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
const projectForm = document.querySelector('#project-form');
const formStatus = document.querySelector('#form-status');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item) => {
  const delay = item.dataset.delay;
  if (delay) item.style.setProperty('--delay', `${delay}ms`);
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.13 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(projectForm);
  const project = String(data.get('proyecto')).trim();
  const service = String(data.get('servicio')).trim();
  const challenge = String(data.get('desafio')).trim();

  const summary = [
    'SOLICITUD DE PROYECTO — HIFA SYSTEMS',
    '=====================================',
    '',
    `Proyecto: ${project}`,
    `Servicio: ${service}`,
    '',
    'Desafío a resolver:',
    challenge,
    '',
    'Documento preparado desde el sitio de HIFA Systems.'
  ].join('\n');

  const file = new Blob([summary], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const download = document.createElement('a');
  const safeName = project
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'proyecto';

  download.href = url;
  download.download = `solicitud-hifa-${safeName}.txt`;
  document.body.appendChild(download);
  download.click();
  download.remove();
  URL.revokeObjectURL(url);

  formStatus.textContent = 'Tu resumen está listo. Descárgalo y compártelo por el canal oficial de HIFA Systems.';
});

document.querySelector('#year').textContent = new Date().getFullYear();
