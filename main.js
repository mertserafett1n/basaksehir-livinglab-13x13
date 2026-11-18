const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');

menu.hidden = false;
document.querySelector('.site-header').classList.add('has-menu');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
}

menu.addEventListener('click', () => {
  setMenu(menu.getAttribute('aria-expanded') !== 'true');
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

window.LivingLab?.initSchedule(document.querySelector('#takvim'));
window.LivingLab?.initHeroGreeting(document.querySelector('.hero'));
