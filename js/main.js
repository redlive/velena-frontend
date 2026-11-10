/* Velena — site behaviour: config values, mobile menu, forms, reveal. */
(function () {
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');
  var RU = (document.documentElement.lang || '').indexOf('ru') === 0;
  var TXT = RU ? {
    mailOpen: 'Сейчас откроется ваша почта с готовым письмом — останется только отправить.',
    sending: 'Отправляем…', sent: 'Спасибо! Сообщение отправлено — мы скоро ответим.',
    failed: 'Не удалось отправить сообщение. Попробуйте ещё раз или позвоните нам: (604) 765-7671.',
    activate: 'Форма ещё не активирована: владельцу сайта отправлено письмо для активации. Пожалуйста, позвоните нам: (604) 765-7671.',
    invalid: 'Пожалуйста, заполните обязательные поля и проверьте email.',
    enquiry: 'Вопрос с сайта', signup: 'Подписка на новости', signupBody: 'Пожалуйста, добавьте меня в рассылку Velena: ',
    name: 'Имя', email: 'Email', phone: 'Телефон', follow: 'Подписаться @', igAlt: 'Публикация Velena Hairstyling House в Instagram'
  } : {
    mailOpen: 'Your email app should open with the message ready to send.',
    sending: 'Sending…', sent: 'Thank you! Your message has been sent. We will be in touch soon.',
    failed: 'Sorry, the message could not be sent. Please try again or call us at (604) 765-7671.',
    activate: 'This form is awaiting activation by the site owner. Please call us at (604) 765-7671 in the meantime.',
    invalid: 'Please fill in the required fields and check your email address.',
    enquiry: 'Website enquiry', signup: 'Email sign-up', signupBody: 'Please add me to the Velena email list: ',
    name: 'Name', email: 'Email', phone: 'Phone', follow: 'Follow @', igAlt: 'Instagram post by Velena Hairstyling House'
  };

  // language: remember an explicit EN/RU choice; on later visits open the remembered
  // language's counterpart page. Never for bots, never without a stored choice.
  var LKEY = 'velena-lang', store = null;
  try { store = window.localStorage; } catch (e) {}
  $$('.lang a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { try { store && store.setItem(LKEY, a.getAttribute('data-lang')); } catch (e) {} });
  });
  (function () {
    if (!store || /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent)) return;
    if (/404\.html$/.test(location.pathname) || !document.querySelector('link[hreflang]')) return;
    var want = null; try { want = store.getItem(LKEY); } catch (e) {}
    var cur = RU ? 'ru' : 'en';
    if (!want || want === cur) return;
    var a = $('.lang a[data-lang="' + want + '"]');
    if (a) location.replace(a.href + location.hash);
  })();

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

  // forms: send in-page (FormSubmit AJAX or Formspree); never falls back to the visitor's mail app
  var F = C.contactForm || {};
  function target() {
    var ep = F.endpoint || '';
    if (/formspree\.io\//.test(ep) || F.provider === 'formspree') return ep ? { url: ep, kind: 'formspree' } : null;
    if (ep) return { url: ep, kind: 'formsubmit' };
    var to = F.recipient || C.email; return to ? { url: 'https://formsubmit.co/ajax/' + encodeURIComponent(to), kind: 'formsubmit' } : null;
  }
  function wire(form, subject, mailSubject, body, status) {
    if (!form) return;
    var btn = form.querySelector('button[type=submit]'), label = btn ? btn.textContent : '';
    function say(msg, ok) { if (status) { status.textContent = msg; status.className = 'fine form-msg ' + (ok ? 'ok' : 'err'); } }
    function mailto(d) { location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(body(d)); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); say(TXT.invalid, false); return; }
      var d = new FormData(form);
      if (d.get('_honey')) { form.reset(); say(TXT.sent, true); return; }   // bot trap
      var t = target(); if (!t || !window.fetch) { mailto(d); say(TXT.mailOpen, true); return; }
      var data = {}; d.forEach(function (v, k) { if (k !== '_honey') data[k] = v; });
      data._subject = d.get('_subject') || subject;
      if (t.kind === 'formsubmit') { data._template = 'table'; data._captcha = 'false'; data._honey = ''; }
      if (data.email && t.kind === 'formsubmit') data._replyto = data.email;
      if (btn) { btn.disabled = true; btn.textContent = TXT.sending; }
      say('', true);
      fetch(t.url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          var ok = res.ok && !(res.j && (res.j.success === false || res.j.success === 'false'));
          if (ok) { form.reset(); say(TXT.sent, true); }
          else { var m = (res.j && res.j.message) || ''; say(/activat/i.test(m) ? (TXT.activate || m) : TXT.failed, false); }
        })
        .catch(function () { say(TXT.failed, false); })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  }
  wire($('#contact-form'), F.subject || 'New message from velena.ca', TXT.enquiry, function (d) {
    return TXT.name + ': ' + d.get('name') + '\n' + TXT.email + ': ' + d.get('email') + '\n' + TXT.phone + ': ' + (d.get('phone') || '') + '\n\n' + d.get('message');
  }, $('#contact-status'));
  wire($('#signup-form'), F.newsletterSubject || 'New newsletter sign-up from velena.ca', TXT.signup, function (d) {
    return TXT.signupBody + d.get('email');
  }, $('#signup-status'));

  // Instagram (footer link + gallery.html)
  var IG = C.instagram || {}, igUrl = IG.handle ? 'https://www.instagram.com/' + IG.handle.replace(/^@/, '') + '/' : '';
  $$('[data-ig-link]').forEach(function (el) {
    if (igUrl) { el.href = igUrl; el.hidden = false; el.removeAttribute('aria-disabled'); if (el.hasAttribute('data-ig-text')) el.textContent = TXT.follow + IG.handle.replace(/^@/, ''); }
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
          im.alt = (p.prunedCaption || p.caption || TXT.igAlt).slice(0, 140);
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
