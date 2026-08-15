/* Scroll reveal — the only animation on the site.
 *
 * THE CONTRACT, which matters more than the effect:
 *   Content is visible by default. The CSS that hides [data-reveal] is scoped
 *   behind `.js` on <html>, and that class is added by a two-line inline script
 *   in each page's <head> — but only after that script has armed a load-event
 *   safety net. If this file 404s, is blocked, or throws, the safety net strips
 *   `.js` again and the whole page is visible. Nothing here is load-bearing.
 *
 * Setting data-reveal-ready="1" is what tells the safety net to stand down.
 * Do not remove it, and do not set it before the observer is actually wired. */
(function () {
  var root = document.documentElement;

  function showAll() {
    var els = document.querySelectorAll('[data-reveal]');
    for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
  }

  function done() {
    root.setAttribute('data-reveal-ready', '1');
  }

  /* Someone who asked their OS for less motion gets no observer at all —
     not an observer whose transitions have been shortened to nothing. */
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
    done();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('is-in');
        io.unobserve(entries[i].target);   /* reveal once, never re-hide */
      }
    }
  }, {
    /* Fires a little before the element reaches the viewport, so the fade has
       finished by the time it is properly in view rather than starting there. */
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.01
  });

  var els = document.querySelectorAll('[data-reveal]');
  for (var i = 0; i < els.length; i++) io.observe(els[i]);

  done();
})();
