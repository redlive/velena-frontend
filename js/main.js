/* Velena — site behaviour: config values, mobile menu, forms, reveal. */
(function () {
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  // config-driven text / links
  $$('[data-cfg="email"]').forEach(function (el) { if (!C.email) return; el.textContent = C.email; el.href = 'mailto:' + C.email; });
  $$('[data-cfg="phone"]').forEach(function (el) { if (!C.phoneTel) return; el.textContent = C.phoneDisplay; el.href = 'tel:' + C.phoneTel; });
  $$('[data-cfg="tel"]').forEach(function (el) { if (C.phoneTel) el.href = 'tel:' + C.phoneTel; });
  $$('[data-cfg="mailto"]').forEach(function (el) { if (!C.email) return; var q = el.getAttribute('href').split('?')[1]; el.href = 'mailto:' + C.email + (q ? '?' + q : ''); });
  $$('[data-cfg="hours"]').forEach(function (el) { if (C.hoursText) el.textContent = C.hoursText; });
  $$('[data-cfg="address"]').forEach(function (el) {
    if (!C.addressLines) return; el.textContent = '';
    C.addressLines.forEach(function (l, i) { if (i) el.appendChild(document.createElement('br')); el.appendChild(document.createTextNode(l)); });
  });
  $$('[data-cfg-href]').forEach(function (el) { var v = C[el.getAttribute('data-cfg-href')]; if (v) el.href = v; });
  $$('[data-cfg-src]').forEach(function (el) { var v = C[el.getAttribute('data-cfg-src')]; if (v) el.src = v; });
  // social
  var S = C.social || {};
  $$('[data-social]').forEach(function (el) { var v = S[el.getAttribute('data-social')]; if (v) { el.href = v; el.hidden = false; } });

  // canonical / og from siteUrl
  if (C.siteUrl) {
    var base = C.siteUrl.replace(/\/?$/, '/'), page = document.documentElement.getAttribute('data-page') || '';
    var c = $('link[rel="canonical"]'); if (c) c.href = base + page;
    var ou = $('meta[property="og:url"]'); if (ou) ou.content = base + page;
    var oi = $('meta[property="og:image"]'); if (oi) oi.content = base + 'images/og-image.jpg';
  }

  // mobile menu
  var hdr = $('header'), burger = $('.burger');
  if (burger) burger.addEventListener('click', function () {
    var open = !hdr.classList.contains('open'); hdr.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr) { hdr.classList.remove('open'); burger && burger.setAttribute('aria-expanded', 'false'); } });

  // forms: POST to configured endpoint, else compose an email
  function wire(form, endpoint, subject, body, status) {
    if (!form) return;
    if (endpoint) { form.action = endpoint; form.method = 'post'; return; }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!form.reportValidity()) return;
      location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body(new FormData(form)));
      if (status) status.textContent = 'Your email app should open with the message ready to send.';
    });
  }
  wire($('#contact-form'), C.contactFormEndpoint, 'Website enquiry', function (d) {
    return 'Name: ' + d.get('name') + '\nEmail: ' + d.get('email') + '\nPhone: ' + (d.get('phone') || '') + '\n\n' + d.get('message');
  }, $('#contact-status'));
  wire($('#signup-form'), C.newsletterEndpoint, 'Email sign-up', function (d) {
    return 'Please add me to the Velena email list: ' + d.get('email');
  }, $('#signup-status'));

  // Instagram (footer link + gallery.html)
  var IG = C.instagram || {}, igUrl = IG.handle ? 'https://www.instagram.com/' + IG.handle.replace(/^@/, '') + '/' : '';
  $$('[data-ig-link]').forEach(function (el) {
    if (igUrl) { el.href = igUrl; el.hidden = false; el.removeAttribute('aria-disabled'); if (el.hasAttribute('data-ig-text')) el.textContent = 'Follow @' + IG.handle.replace(/^@/, ''); }
  });
  $$('[data-ig-soon]').forEach(function (el) { el.hidden = !!igUrl; });
  var feed = $('#ig-feed'), fallback = $('#ig-fallback');
  function showFeed() { if (feed && fallback) { feed.hidden = false; fallback.hidden = true; } }
  if (feed) {
    if (IG.widget === 'behold' && IG.feedId) {
      fetch('https://feeds.behold.so/' + encodeURIComponent(IG.feedId)).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (d) {
        var posts = Array.isArray(d) ? d : (d.posts || []); if (!posts.length) return;
        var grid = document.createElement('div'); grid.className = 'gallery';
        posts.forEach(function (p) {
          var src = (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.thumbnailUrl || p.mediaUrl; if (!src) return;
          var a = document.createElement('a'); a.href = p.permalink; a.target = '_blank'; a.rel = 'noopener'; a.className = 'gi';
          var im = document.createElement('img'); im.src = src; im.loading = 'lazy';
          im.alt = (p.prunedCaption || p.caption || 'Instagram post by Velena Hairstyling House').slice(0, 140);
          a.appendChild(im); grid.appendChild(a);
        });
        feed.appendChild(grid); showFeed();
      }).catch(function () { /* keep the follow block */ });
    } else if (IG.widget === 'snapwidget' && IG.snapwidgetId) {
      var f = document.createElement('iframe');
      f.src = 'https://snapwidget.com/embed/' + encodeURIComponent(IG.snapwidgetId); f.className = 'snapwidget-widget ig-frame';
      f.setAttribute('allowtransparency', 'true'); f.setAttribute('scrolling', 'no'); f.title = 'Latest Instagram posts'; f.loading = 'lazy';
      feed.appendChild(f);
      var sw = document.createElement('script'); sw.src = 'https://snapwidget.com/js/snapwidget.js'; sw.async = true; feed.appendChild(sw);
      showFeed();
    } else if (IG.widget === 'posts' && IG.postUrls && IG.postUrls.length) {
      var wrap = document.createElement('div'); wrap.className = 'ig-posts';
      IG.postUrls.forEach(function (u) {
        var b = document.createElement('blockquote'); b.className = 'instagram-media';
        b.setAttribute('data-instgrm-permalink', u); b.setAttribute('data-instgrm-version', '14');
        var a = document.createElement('a'); a.href = u; a.textContent = 'View this post on Instagram'; b.appendChild(a); wrap.appendChild(b);
      });
      feed.appendChild(wrap);
      var es = document.createElement('script'); es.src = 'https://www.instagram.com/embed.js'; es.async = true; document.body.appendChild(es);
      showFeed();
    }
  }

  // year + gentle reveal
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }
})();
