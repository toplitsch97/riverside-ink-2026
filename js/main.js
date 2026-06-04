/* =====================================================================
   RIVERSIDE INK 2026 — interactions
   Lenis smooth scroll + GSAP ScrollTrigger + reveals, counters, nav,
   lightbox, accordion. Degrades gracefully without JS / reduced-motion.
   ===================================================================== */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.09 });
    window.lenisInstance = lenis;
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Anchor links via Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(el, { offset: -60 }) : el.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  function closeMenu(){ menu && menu.classList.remove('open'); document.documentElement.classList.remove('lenis-stopped'); }
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      lenis && (open ? lenis.stop() : lenis.start());
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { closeMenu(); lenis && lenis.start(); }));
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; cio.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const dur = 1800; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.firstChild ? (el.childNodes[0].nodeValue = Math.floor(eased * target).toLocaleString('de-CH'))
                      : (el.textContent = Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  /* ---------- GSAP: pinned word-by-word statement ---------- */
  if (hasGSAP && window.ScrollTrigger && !reduce) {
    const statement = document.querySelector('.statement');
    if (statement) {
      const words = statement.querySelectorAll('.word');
      ScrollTrigger.create({
        trigger: statement, start: 'top top', end: '+=120%', pin: true, scrub: 0.6,
        onUpdate: (self) => {
          const lit = Math.floor(self.progress * words.length);
          words.forEach((w, i) => w.classList.toggle('lit', i <= lit));
        }
      });
    }

    /* Parallax: hero media + band video + tagged elements */
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        yPercent: speed * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Services slide-in */
    gsap.utils.toArray('.svc').forEach((card, i) => {
      gsap.from(card, {
        y: 80, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' }, delay: (i % 2) * 0.08
      });
    });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion__head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.parentElement;
      const body = item.querySelector('.accordion__body');
      const open = item.classList.toggle('open');
      body.style.maxHeight = open ? body.scrollHeight + 'px' : 0;
    });
  });

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.gallery-grid figure').forEach(fig => {
      const show = f === 'all' || fig.dataset.cat === f;
      fig.style.display = show ? '' : 'none';
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const figs = Array.from(document.querySelectorAll('.gallery-grid figure'));
    let idx = 0;
    const srcOf = (fig) => fig.dataset.full || fig.querySelector('img').src;
    const open = (i) => {
      idx = (i + figs.length) % figs.length;
      lbImg.src = srcOf(figs[idx]); lb.classList.add('open');
      lenis && lenis.stop();
    };
    const close = () => { lb.classList.remove('open'); lenis && lenis.start(); };
    figs.forEach((fig, i) => fig.addEventListener('click', () => open(i)));
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', () => open(idx - 1));
    lb.querySelector('.next').addEventListener('click', () => open(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(idx - 1);
      if (e.key === 'ArrowRight') open(idx + 1);
    });
  }

  /* ---------- Active nav link by current page ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && (href === './' || href === 'index.html'))) a.classList.add('active');
  });

  /* ---------- Ensure hero video plays (autoplay policies) ---------- */
  document.querySelectorAll('video[autoplay]').forEach(v => {
    v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {});
  });
})();
