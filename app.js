/* ============================================================
   VIATEC homepage — lightweight interactions
   ============================================================ */
(function () {
  'use strict';

  // keep the page anchored at top on load (no browser scroll-restoration), so
  // scroll-triggered animations are only ever earned by a real scroll gesture
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---- announcement dismiss ---- */
  var announce = document.getElementById('announce');
  var announceClose = document.getElementById('announceClose');
  if (announceClose) {
    announceClose.addEventListener('click', function () {
      announce.style.display = 'none';
    });
  }

  /* ---- sticky header shadow ---- */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer ---- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var drawerClose = document.getElementById('drawerClose');
  if (burger && drawer) {
    burger.addEventListener('click', function () { drawer.classList.add('open'); });
    drawerClose.addEventListener('click', function () { drawer.classList.remove('open'); });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { drawer.classList.remove('open'); });
    });
  }

  /* ---- logo marquee (trusted-by) ---- */
  var LOGOS = ['Fortis', 'SaskPower', 'CPS Energy', 'Versalift', 'Burlington', 'Unitil',
    'Glenwood', 'PNM', 'BC Hydro', 'Con Edison', 'Block Island', 'MidAmerican',
    'NiSource', 'Southern Co', 'Xcel', 'Umatilla', 'PPL', 'PG&E', 'Palfinger',
    'Dominion', 'ATCO', 'Cornwall', 'Wajax', 'Exelon', 'Oncor', 'Enmax',
    'Hydro-Québec', 'Cleco', 'Ring Power', 'Portland GE', 'LADWP', 'Asplundh', 'Duke Energy'];

  function fillTrack(id, list) {
    var track = document.getElementById(id);
    if (!track) return;
    var html = '';
    // duplicate the list so the -50% loop is seamless
    [].concat(list, list).forEach(function (name) {
      html += '<div class="logo-cell"><span class="logo-chip">' + name + '</span></div>';
    });
    track.innerHTML = html;
  }
  fillTrack('track1', LOGOS.slice(0, 17));
  fillTrack('track2', LOGOS.slice(17));

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- hero stats panel: fade-up entrance + count, triggered on scroll-in ---- */
  var statsPanel = document.querySelector('.hero--a__stats');
  if (statsPanel) {
    var statsRevealed = false;
    var statsStartY = window.scrollY; // baseline — reveal only after real scroll movement
    var revealStats = function () {
      if (statsRevealed) return;
      // never on first paint, and robust to scroll-restoration on refresh:
      // require the user to actually scroll down from wherever the page loaded
      if (window.scrollY < statsStartY + 48) return;
      var r = statsPanel.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // then fire once the panel is comfortably within the viewport
      if (r.top < vh * 0.7 && r.bottom > 0) {
        statsRevealed = true;
        statsPanel.classList.add('is-in');
        var media = statsPanel.closest('.hero--a__media');
        var colored = false;
        // the truck blooms into color in lock-step with the numbers finishing
        // their count and turning blue — not with the scroll trigger itself
        var onCounted = function () {
          if (colored || !media) return;
          colored = true;
          media.classList.add('is-color');
        };
        statsPanel.querySelectorAll('[data-count]').forEach(function (el) {
          animateCount(el, onCounted);
        });
        window.removeEventListener('scroll', onStatsScroll);
      }
    };
    var onStatsScroll = function () { revealStats(); };
    window.addEventListener('scroll', onStatsScroll, { passive: true });
    // do NOT call revealStats() on load — it must be earned by a scroll gesture
  }

  /* ---- fuel gauge: hold on empty, then "charge" to full when scrolled in ---- */
  var gaugeFig = document.querySelector('.gauge');
  if (gaugeFig) {
    var gaugeCharged = false;
    var checkGauge = function () {
      if (gaugeCharged) return;
      var r = gaugeFig.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.68 && r.bottom > vh * 0.1) {
        gaugeCharged = true;
        window.removeEventListener('scroll', onGaugeScroll);
        setTimeout(function () { gaugeFig.classList.add('is-charged'); }, 480); // let "empty" register first
      }
    };
    var onGaugeScroll = function () { checkGauge(); };
    window.addEventListener('scroll', onGaugeScroll, { passive: true });
    checkGauge();
  }

  /* ---- count-up numbers ---- */
  function animateCount(el, onDone) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1300, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(dec);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else { el.textContent = prefix + target.toFixed(dec) + suffix; el.classList.add('counted'); if (onDone) onDone(); }
    }
    requestAnimationFrame(frame);
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'))
    .filter(function (el) { return !el.closest('.hero--a__stats'); });
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---- FAQ accordion ---- */
  var faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.querySelectorAll('.faq__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var ans = item.querySelector('.faq__a');
        var open = item.classList.contains('is-open');
        // close siblings
        faqList.querySelectorAll('.faq__item').forEach(function (it) {
          it.classList.remove('is-open');
          it.querySelector('.faq__a').style.maxHeight = null;
        });
        if (!open) {
          item.classList.add('is-open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- audience tabs ---- */
  var tabs = document.querySelectorAll('.aud__tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      document.querySelectorAll('.aud__panel').forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-panel') === key);
      });
    });
  });

  /* ---- smooth in-page anchor scroll (offset for sticky header) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
