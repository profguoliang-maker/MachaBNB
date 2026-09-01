/* MachaBNB — Gallery Edition scripts */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      faqItems.forEach(function (i) { i.classList.remove('is-open'); });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Gallery: reveal masonry items on load (staggered) ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));
  items.forEach(function (item, i) {
    setTimeout(function () { item.classList.add('is-shown'); }, 40 * (i % 12));
  });

  /* ---------- Gallery filter chips ---------- */
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var cat = chip.getAttribute('data-filter');
      items.forEach(function (item, i) {
        var match = cat === 'all' || item.getAttribute('data-category') === cat;
        item.classList.remove('is-hidden');
        if (match) {
          item.classList.remove('is-hidden');
          setTimeout(function () { item.classList.add('is-shown'); }, 30 * i);
        } else {
          item.classList.remove('is-shown');
          setTimeout(function () { item.classList.add('is-hidden'); }, 300);
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbTag = lightbox.querySelector('.m-tag');
    var lbTitle = lightbox.querySelector('.lb-title');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');
    var visibleItems = [];
    var currentIndex = 0;

    function refreshVisible() {
      visibleItems = items.filter(function (item) { return !item.classList.contains('is-hidden'); });
    }

    function openAt(item) {
      refreshVisible();
      currentIndex = visibleItems.indexOf(item);
      renderCurrent();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function renderCurrent() {
      var item = visibleItems[currentIndex];
      if (!item) return;
      var img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbTag.textContent = item.getAttribute('data-tag') || '';
      lbTitle.textContent = item.getAttribute('data-title') || '';
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function next() {
      if (!visibleItems.length) return;
      currentIndex = (currentIndex + 1) % visibleItems.length;
      renderCurrent();
    }
    function prev() {
      if (!visibleItems.length) return;
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      renderCurrent();
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () { openAt(item); });
    });

    if (lbClose) lbClose.addEventListener('click', close);
    if (lbNext) lbNext.addEventListener('click', next);
    if (lbPrev) lbPrev.addEventListener('click', prev);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ---------- Current year in footer ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* ---------- WhatsApp booking helper ----------
   Every booking action routes straight to WhatsApp with a pre-filled message.
*/
function whatsappBook(item) {
  var phone = '254704498509';
  var base = 'Hello MachaBNB! I would like to book';
  var msg = item ? (base + ' ' + item + '. Could you confirm availability?') : (base + '. Could you help me with availability and rates?');
  var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank', 'noopener');
}
