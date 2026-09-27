/* =========================================================================
   Kozy & Klean — Consentement aux témoins (Loi 25, Québec) + Microsoft Clarity
   -------------------------------------------------------------------------
   • RIEN n'est chargé tant que le visiteur n'a pas cliqué « Accepter »
     (Loi 25, art. 8.1 : technologies de profilage désactivées par défaut).
   • « Refuser » a exactement le même poids visuel que « Accepter ».
   • Le choix est mémorisé 12 mois (acceptation) ou 6 mois (refus), puis
     redemandé. Augmenter CONSENT_VERSION force une nouvelle demande à tout
     le monde (à faire si vous ajoutez un nouvel outil de suivi).
   • Le visiteur peut changer d'avis en tout temps : bouton « Gérer mes
     témoins » (pied de page + politique de confidentialité). Un retrait
     efface les témoins Clarity et recharge la page pour couper le script.
   • Ne JAMAIS appeler clarity('identify', ...) avec un nom, un courriel ou
     un téléphone : Clarity doit rester sans renseignement identifiant.
   ========================================================================= */
(function(){
  "use strict";

  /* 1) Collez ici l'identifiant de votre projet Clarity :
        clarity.microsoft.com → votre projet → Settings → Overview → Project ID
        (une dizaine de lettres/chiffres, ex. "abc123xyz0").
        Tant que la valeur commence par "COLLEZ_", la bannière s'affiche
        quand même mais aucun outil n'est chargé. */
  var CLARITY_PROJECT_ID = "COLLEZ_VOTRE_ID_CLARITY";

  var STORAGE_KEY = "kk_consent";
  var CONSENT_VERSION = 1;
  var DAYS_IF_ACCEPTED = 365;
  var DAYS_IF_REFUSED = 180;

  /* ---- langue et chemins (fonctionne sur Netlify, GitHub Pages et en local) ---- */
  var LANG = (document.documentElement.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase();
  if(['fr', 'en', 'es'].indexOf(LANG) === -1) LANG = 'fr';
  var me = document.currentScript;
  var ROOT = (me && me.src) ? new URL('../', me.src).href : '/';
  var POLICY_URL = ROOT + ({ fr: 'confidentialite.html', en: 'en/privacy.html', es: 'es/privacidad.html' })[LANG];

  var TXT = {
    fr: {
      title: "Votre vie privée, vos choix",
      desc: "Avec votre accord, nous mesurons la fréquentation du site à l'aide de témoins (outil de Microsoft) afin de l'améliorer. Certaines données sont traitées hors du Québec. Vous pouvez refuser ou changer d'avis en tout temps.",
      policy: "Politique de confidentialité",
      refuse: "Refuser",
      accept: "Accepter",
      customize: "Personnaliser",
      prefsTitle: "Personnaliser mes choix",
      essTitle: "Essentiels",
      essDesc: "Mémorisent vos choix sur cet appareil.",
      always: "Toujours actifs",
      anaTitle: "Mesure d'audience",
      anaDesc: "Nous aide à comprendre ce qui vous intéresse pour améliorer le site. Outil : Microsoft Clarity; données traitées hors du Québec.",
      refuseAll: "Tout refuser",
      save: "Enregistrer mes choix",
      back: "Retour",
      region: "Choix de confidentialité"
    },
    en: {
      title: "Your privacy, your choice",
      desc: "With your permission, we use cookies (a Microsoft tool) to measure site traffic and improve the site. Some data is processed outside Québec. You can decline or change your mind at any time.",
      policy: "Privacy policy",
      refuse: "Decline",
      accept: "Accept",
      customize: "Customize",
      prefsTitle: "Customize my choices",
      essTitle: "Essential",
      essDesc: "Remember your choices on this device.",
      always: "Always on",
      anaTitle: "Audience measurement",
      anaDesc: "Helps us understand what interests you so we can improve the site. Tool: Microsoft Clarity; data processed outside Québec.",
      refuseAll: "Decline all",
      save: "Save my choices",
      back: "Back",
      region: "Privacy choices"
    },
    es: {
      title: "Su privacidad, su elección",
      desc: "Con su permiso, medimos las visitas al sitio mediante cookies (herramienta de Microsoft) para mejorarlo. Algunos datos se tratan fuera de Quebec. Puede rechazarlas o cambiar de opinión en cualquier momento.",
      policy: "Política de privacidad",
      refuse: "Rechazar",
      accept: "Aceptar",
      customize: "Personalizar",
      prefsTitle: "Personalizar mis opciones",
      essTitle: "Esenciales",
      essDesc: "Recuerdan sus opciones en este dispositivo.",
      always: "Siempre activas",
      anaTitle: "Medición de audiencia",
      anaDesc: "Nos ayuda a entender qué le interesa para mejorar el sitio. Herramienta: Microsoft Clarity; datos tratados fuera de Quebec.",
      refuseAll: "Rechazar todo",
      save: "Guardar mis opciones",
      back: "Volver",
      region: "Opciones de privacidad"
    }
  };
  var T = TXT[LANG];

  /* ---- mémorisation du choix (stockage local, essentiel) ---- */
  function readChoice(){
    try{
      var c = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if(!c || c.v !== CONSENT_VERSION || !c.date) return null;
      var maxAge = (c.analytics ? DAYS_IF_ACCEPTED : DAYS_IF_REFUSED) * 864e5;
      if(Date.now() - new Date(c.date).getTime() > maxAge) return null;
      return c;
    }catch(e){ return null; }
  }
  function saveChoice(analytics){
    var c = { v: CONSENT_VERSION, analytics: !!analytics, date: new Date().toISOString() };
    try{ window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }catch(e){}
    return c;
  }

  /* ---- Microsoft Clarity ---- */
  var clarityLoaded = false;
  function hasClarityId(){ return /^[a-z0-9]{6,16}$/i.test(CLARITY_PROJECT_ID); }

  function loadClarity(){
    if(clarityLoaded || !hasClarityId()) return;
    clarityLoaded = true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
    /* aucun usage publicitaire : seul le stockage « mesure d'audience » est accordé */
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    window.clarity('set', 'langue', LANG);
  }

  function clearClarityCookies(){
    var host = location.hostname;
    var parts = host.split('.');
    var domains = ['', host, '.' + host];
    if(parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    ['_clck', '_clsk'].forEach(function(name){
      domains.forEach(function(d){
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function revokeClarity(){
    if(typeof window.clarity === 'function'){
      try{
        window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
        window.clarity('consent', false);
      }catch(e){}
    }
    clearClarityCookies();
  }

  /* Événements personnalisés (visibles dans Clarity → Filtres → Événements
     personnalisés). Ignorés tant que le visiteur n'a pas accepté. */
  function track(name){
    if(current && current.analytics && clarityLoaded && typeof window.clarity === 'function'){
      try{ window.clarity('event', name); }catch(e){}
    }
  }

  /* ---- bannière ---- */
  var current = readChoice();
  var banner, mainView, prefsView, anaSwitch, lastFocus;

  function el(tag, attrs, children){
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function(k){
      if(k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function(c){ if(c) n.appendChild(c); });
    return n;
  }

  function buildBanner(){
    if(banner) return;
    anaSwitch = el('input', { type: 'checkbox', role: 'switch', id: 'kkc-analytics', 'class': 'kk-switch' });

    mainView = el('div', { 'class': 'kkc-view' }, [
      el('h2', { 'class': 'kkc-title', id: 'kkc-title', text: T.title }),
      el('p', { 'class': 'kkc-desc', text: T.desc }),
      el('p', { 'class': 'kkc-policy' }, [ el('a', { href: POLICY_URL, text: T.policy }) ]),
      el('div', { 'class': 'kkc-actions' }, [
        el('button', { type: 'button', 'class': 'kkc-btn', 'data-kkc': 'refuse', text: T.refuse }),
        el('button', { type: 'button', 'class': 'kkc-btn', 'data-kkc': 'accept', text: T.accept })
      ]),
      el('button', { type: 'button', 'class': 'kkc-link', 'data-kkc': 'customize', text: T.customize })
    ]);

    prefsView = el('div', { 'class': 'kkc-view', hidden: '' }, [
      el('h2', { 'class': 'kkc-title', id: 'kkc-prefs-title', tabindex: '-1', text: T.prefsTitle }),
      el('div', { 'class': 'kkc-row' }, [
        el('div', {}, [ el('h3', { text: T.essTitle }), el('p', { text: T.essDesc }) ]),
        el('span', { 'class': 'kkc-always', text: T.always })
      ]),
      el('div', { 'class': 'kkc-row' }, [
        el('div', {}, [
          el('h3', {}, [ el('label', { 'for': 'kkc-analytics', text: T.anaTitle }) ]),
          el('p', { id: 'kkc-ana-desc', text: T.anaDesc })
        ]),
        anaSwitch
      ]),
      el('p', { 'class': 'kkc-policy' }, [ el('a', { href: POLICY_URL, text: T.policy }) ]),
      el('div', { 'class': 'kkc-actions' }, [
        el('button', { type: 'button', 'class': 'kkc-btn', 'data-kkc': 'refuse', text: T.refuseAll }),
        el('button', { type: 'button', 'class': 'kkc-btn', 'data-kkc': 'save', text: T.save })
      ]),
      el('button', { type: 'button', 'class': 'kkc-link', 'data-kkc': 'back', text: T.back })
    ]);
    anaSwitch.setAttribute('aria-describedby', 'kkc-ana-desc');

    banner = el('div', { 'class': 'kk-consent', role: 'region', 'aria-label': T.region, hidden: '' }, [
      el('div', { 'class': 'kkc-card' }, [ mainView, prefsView ])
    ]);

    banner.addEventListener('click', function(e){
      var btn = e.target.closest ? e.target.closest('[data-kkc]') : null;
      if(!btn) return;
      var action = btn.getAttribute('data-kkc');
      if(action === 'accept') applyChoice(true);
      else if(action === 'refuse') applyChoice(false);
      else if(action === 'save') applyChoice(anaSwitch.checked);
      else if(action === 'customize') showView('prefs');
      else if(action === 'back') showView('main');
    });
    banner.addEventListener('keydown', function(e){
      /* Échap referme seulement si un choix existe déjà (sinon aucun consentement n'est présumé) */
      if(e.key === 'Escape' && current) hideBanner();
    });

    document.body.insertBefore(banner, document.body.firstChild);
  }

  function showView(which){
    mainView.hidden = (which !== 'main');
    prefsView.hidden = (which !== 'prefs');
    if(which === 'prefs'){
      anaSwitch.checked = !!(current && current.analytics);
      var t = document.getElementById('kkc-prefs-title');
      if(t) t.focus();
    }
  }

  function showBanner(view, moveFocus){
    buildBanner();
    lastFocus = moveFocus ? document.activeElement : null;
    banner.hidden = false;
    showView(view || 'main');
    if(moveFocus && view !== 'prefs'){
      var first = banner.querySelector('[data-kkc]');
      if(first) first.focus();
    }
  }

  function hideBanner(){
    if(!banner) return;
    banner.hidden = true;
    if(lastFocus && lastFocus.focus){ try{ lastFocus.focus(); }catch(e){} }
    lastFocus = null;
  }

  function applyChoice(analytics){
    current = saveChoice(analytics);
    if(analytics){
      loadClarity();
      hideBanner();
      return;
    }
    revokeClarity();
    hideBanner();
    /* Clarity déjà chargé dans cette page : on recharge pour couper le script complètement */
    if(clarityLoaded) window.location.reload();
  }

  /* ---- démarrage ---- */
  function init(){
    if(current && current.analytics){
      loadClarity();
    }else{
      clearClarityCookies(); /* nettoie d'éventuels restes d'un ancien consentement */
      if(!current) showBanner('main', false);
    }

    /* boutons « Gérer mes témoins » (pied de page, politique) */
    document.addEventListener('click', function(e){
      var opener = e.target.closest ? e.target.closest('[data-kk-consent-open]') : null;
      if(opener){ e.preventDefault(); showBanner('prefs', true); }
    });

    /* clics utiles à mesurer : appels, courriels, Facebook */
    document.addEventListener('click', function(e){
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if(!a) return;
      var href = a.getAttribute('href') || '';
      if(/^tel:/i.test(href)) track('clic_telephone');
      else if(/^mailto:/i.test(href)) track('clic_courriel');
      else if(/facebook\.com/i.test(href)) track('clic_facebook');
    }, true);
  }

  window.KKConsent = {
    open: function(){ showBanner('prefs', true); },
    track: track,
    hasAnalyticsConsent: function(){ return !!(current && current.analytics); }
  };

  if(document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
