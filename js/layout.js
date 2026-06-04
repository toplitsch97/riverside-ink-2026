/* =====================================================================
   RIVERSIDE INK 2026 — shared layout
   Injects grain, nav, mobile menu, footer and WhatsApp float into every
   page so the chrome lives in ONE place. Runs before main.js.
   ===================================================================== */
(() => {
  const NAV = [
    ['Tattoo', 'tattoo.html'],
    ['Piercing', 'piercing.html'],
    ['Bodymod', 'bodymodification.html'],
    ['Beauty', 'beauty.html'],
    ['Shop', 'shop.html'],
    ['Conventions', 'conventions.html'],
    ['Gallery', 'gallery.html'],
    ['Kontakt', 'kontakt.html'],
  ];

  const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.3.1.7-.1 1.3Z"/></svg>';

  const navLinks = NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('');

  const header = `
  <div class="grain"></div>
  <header class="nav">
    <a class="nav__logo" href="index.html"><img src="assets/brand/logo.png" alt="Riverside Ink"></a>
    <nav class="nav__links">${navLinks}</nav>
    <a class="btn nav__cta" href="kontakt.html">Termin anfragen</a>
    <button class="nav__burger" aria-label="Menü"><span></span><span></span><span></span></button>
  </header>
  <div class="mobile-menu">${navLinks}</div>`;

  const footer = `
  <footer class="footer">
    <div class="wrap footer__grid">
      <div class="footer__brand">
        <img src="assets/brand/logo.png" alt="Riverside Ink">
        <p>Tattoo · Piercing · Bodymodification · Beauty. Im amerikanischen Stil — mit feinem Shop. St. Margrethen &amp; St. Gallen.</p>
        <div class="footer__social">
          <a href="https://www.instagram.com/riverside_ink.ch/" aria-label="Instagram">IG</a>
          <a href="https://www.facebook.com/riversideink.lifestyle" aria-label="Facebook">FB</a>
          <a href="https://wa.me/+41766334166" aria-label="WhatsApp">WA</a>
        </div>
      </div>
      <div><h4>Services</h4><ul>
        <li><a href="tattoo.html">Tattoo</a></li>
        <li><a href="piercing.html">Piercing</a></li>
        <li><a href="bodymodification.html">Bodymodification</a></li>
        <li><a href="beauty.html">Beauty</a></li>
        <li><a href="laser.html">Laser</a></li>
        <li><a href="gastro.html">Gastro</a></li>
      </ul></div>
      <div><h4>Studio</h4><ul>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="conventions.html">Conventions</a></li>
        <li><a href="kontakt.html#standorte">Standorte</a></li>
        <li><a href="kontakt.html#jobs">Offene Stellen</a></li>
      </ul></div>
      <div><h4>Kontakt</h4><ul>
        <li><a href="mailto:info@r-ink.ch">info@r-ink.ch</a></li>
        <li><a href="https://wa.me/+41762288977">+41 76 228 89 77</a></li>
        <li><a href="impressum.html">Impressum</a></li>
        <li><a href="datenschutz.html">Datenschutz</a></li>
      </ul></div>
    </div>
    <div class="wrap footer__bottom">
      <span>© 2026 Riverside Ink — Designed for the future.</span>
      <span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span>
    </div>
  </footer>
  <a class="wa-float" href="https://wa.me/+41762288977">${WA_ICON}Schreib uns!</a>`;

  // Inject header at very top of body, footer at very end.
  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
