const track = document.getElementById('galleryTrack');
const slides = [...document.querySelectorAll('.slide')];
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const current = document.getElementById('current');
const total = document.getElementById('total');
const dots = document.getElementById('dots');
const shell = document.querySelector('.gallery-shell');

const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lightboxImage');
const lbCaption = document.getElementById('lightboxCaption');
const lbClose = document.querySelector('.lightbox-close');
const lbPrev = document.querySelector('.lb-prev');
const lbNext = document.querySelector('.lb-next');

let index = 0;
let startX = null;
total.textContent = slides.length;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Show image ${i + 1}`);
  dot.addEventListener('click', () => go(i));
  dots.appendChild(dot);
});

function go(i){
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
  current.textContent = index + 1;
  [...dots.children].forEach((d, j) => d.classList.toggle('active', j === index));
  if(lightbox.classList.contains('open')) updateLightbox();
}
function change(delta){ go(index + delta); }

prev.addEventListener('click', () => change(-1));
next.addEventListener('click', () => change(1));

shell.addEventListener('keydown', e => {
  if(e.key === 'ArrowLeft') change(-1);
  if(e.key === 'ArrowRight') change(1);
});

track.addEventListener('touchstart', e => startX = e.changedTouches[0].clientX, {passive:true});
track.addEventListener('touchend', e => {
  if(startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx) > 45) change(dx > 0 ? -1 : 1);
  startX = null;
}, {passive:true});

slides.forEach((slide, i) => slide.addEventListener('click', () => {
  index = i;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}));

function updateLightbox(){
  const img = slides[index].querySelector('img');
  const cap = slides[index].querySelector('figcaption');
  lbImage.src = img.src;
  lbImage.alt = img.alt;
  lbCaption.textContent = cap ? cap.textContent : '';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => change(-1));
lbNext.addEventListener('click', () => change(1));
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') change(-1);
  if(e.key === 'ArrowRight') change(1);
});
