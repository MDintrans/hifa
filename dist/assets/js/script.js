const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
const projectForm = document.querySelector('#project-form');
const formStatus = document.querySelector('#form-status');
const backTopLink = document.querySelector('.back-top');
const whatsappLink = document.querySelector('#whatsapp-link');
const emailLink = document.querySelector('#email-link');
const emailLabel = document.querySelector('#contact-email-label');
const contactConfig = window.HIFA_CONTACT || {};

// Activa los canales cuando sus datos estén definidos en contact-config.js.
const whatsappNumber = String(contactConfig.whatsappNumber || '').replace(/\D/g, '');
const contactEmail = String(contactConfig.contactEmail || '').trim();
const formEndpoint = String(contactConfig.formEndpoint || '').trim();

if (whatsappNumber) {
  const whatsappMessage = encodeURIComponent('Hola HIFA Systems, quiero conversar sobre un proyecto.');
  whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  whatsappLink.removeAttribute('aria-disabled');
} else {
  whatsappLink.addEventListener('click', (event) => event.preventDefault());
}

if (contactEmail) {
  emailLink.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Consulta desde el sitio de HIFA Systems')}`;
  emailLabel.textContent = contactEmail;
  emailLink.removeAttribute('aria-disabled');
} else {
  emailLink.addEventListener('click', (event) => event.preventDefault());
}

// Cambia la apariencia de la cabecera al desplazarse por la página.
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Controla el menú de navegación en pantallas pequeñas.
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

// Regresa al inicio desde el pie de página y respeta las preferencias de movimiento.
backTopLink.addEventListener('click', (event) => {
  event.preventDefault();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  if (window.location.hash !== '#inicio') history.pushState(null, '', '#inicio');
});

// Muestra progresivamente los bloques cuando entran en el área visible.
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

// Envía el formulario al servicio configurado. Mientras no exista un endpoint,
// conserva la solicitud como archivo local para no perder la información.
projectForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(projectForm);
  const name = String(data.get('nombre')).trim();
  const email = String(data.get('email')).trim();
  const project = String(data.get('proyecto')).trim();
  const service = String(data.get('servicio')).trim();
  const challenge = String(data.get('desafio')).trim();

  const summary = [
    'SOLICITUD DE PROYECTO — HIFA SYSTEMS',
    '=====================================',
    '',
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Proyecto: ${project}`,
    `Servicio: ${service}`,
    '',
    'Desafío a resolver:',
    challenge,
    '',
    'Documento preparado desde el sitio de HIFA Systems.'
  ].join('\n');

  formStatus.classList.remove('is-error');

  if (formEndpoint) {
    const submitButton = projectForm.querySelector('button[type="submit"]');
    const originalLabel = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando…';
    formStatus.textContent = 'Estamos enviando tu solicitud.';

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      projectForm.reset();
      formStatus.textContent = '¡Gracias! Recibimos tu solicitud y te contactaremos pronto.';
    } catch (error) {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'No pudimos enviar la solicitud. Intenta nuevamente o utiliza uno de los canales directos.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }

    return;
  }

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

  formStatus.classList.add('is-error');
  formStatus.textContent = 'El envío por correo aún no está configurado. Guardamos una copia local de tu solicitud.';
});

// Mantiene actualizado el año del pie de página.
document.querySelector('#year').textContent = new Date().getFullYear();
