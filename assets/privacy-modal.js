/* =========================================================================
   Kozy & Klean — Politique de confidentialité en fenêtre (pop-up) déroulante
   -------------------------------------------------------------------------
   • Tout lien vers la page de politique (pied de page, avis sous les
     formulaires, bannière de consentement) ouvre la politique dans une
     fenêtre par-dessus le site, au lieu de quitter la page.
   • Le texte vient du bloc <template id="privacy-content"> placé dans
     chaque page d'accueil (FR / EN / ES) : ça marche en ligne ET en local
     (fichier ouvert directement dans le navigateur).
     Ce texte est le même que celui des pages confidentialite.html,
     en/privacy.html et es/privacidad.html : modifier les deux ensemble.
   • Sans ce bloc, le texte est lu dans la page de politique (en ligne
     seulement); si rien ne marche, le lien mène à la page, comme avant.
   • Ctrl/Cmd + clic garde le comportement normal (nouvel onglet).
   ========================================================================= */
(function(){
  "use strict";

  var LANG = (document.documentElement.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase();
  if(['fr', 'en', 'es'].indexOf(LANG) === -1) LANG = 'fr';
  var me = document.currentScript;
  var ROOT = (me && me.src) ? new URL('../', me.src).href : '/';
  var POLICY_URL = ROOT + ({ fr: 'confidentialite.html', en: 'en/privacy.html', es: 'es/privacidad.html' })[LANG];
  /* Netlify (« Pretty URLs ») réécrit les liens « confidentialite.html » en
     « /confidentialite » : on compare donc les chemins sans « .html » ni « / » final. */
  function normPath(p){ return p.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/, ''); }
  var POLICY_PATH = normPath(new URL(POLICY_URL).pathname);
  var CLOSE_LABEL = ({ fr: 'Fermer', en: 'Close', es: 'Cerrar' })[LANG];

  var backdrop, modal, content, loaded = false, loading = null, lastFocus = null;

  function build(){
    if(modal) return;
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.hidden = true;

    modal = document.createElement('div');
    modal.className = 'privacy-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'privacy-modal-title');

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', CLOSE_LABEL);
    closeBtn.innerHTML = '&times;';

    content = document.createElement('div');
    content.className = 'privacy-modal-body legal';
    content.tabIndex = -1; /* reçoit le focus : les flèches du clavier font défiler */

    modal.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    /* « Gérer mes témoins » dans la fenêtre : on la ferme, consent.js ouvre les préférences */
    modal.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('[data-kk-consent-open]')) close();
    });
  }

  function load(){
    if(loaded) return Promise.resolve();
    var tpl = document.getElementById('privacy-content');
    if(tpl && tpl.innerHTML.trim()){
      content.innerHTML = tpl.innerHTML;
      loaded = true;
      return Promise.resolve();
    }
    if(loading) return loading;
    loading = fetch(POLICY_URL, { credentials: 'same-origin' })
      .then(function(r){ if(!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var main = doc.querySelector('main.legal');
        if(!main) throw new Error('contenu introuvable');
        /* retire le bouton « Retour au site », inutile dans une fenêtre */
        Array.prototype.forEach.call(main.querySelectorAll('.legal-back'), function(n){ n.remove(); });
        /* le grand titre devient le titre de la fenêtre */
        var h1 = main.querySelector('h1');
        if(h1){
          var h2 = doc.createElement('h2');
          h2.id = 'privacy-modal-title';
          h2.className = 'privacy-modal-title';
          h2.innerHTML = h1.innerHTML;
          h1.replaceWith(h2);
        }
        content.innerHTML = main.innerHTML;
        loaded = true;
      });
    loading.catch(function(){ loading = null; });
    return loading;
  }

  function open(){
    build();
    lastFocus = document.activeElement;
    return load().then(function(){
      backdrop.hidden = false;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      content.scrollTop = 0;
      content.focus({ preventScroll: true });
    });
  }

  function close(){
    if(!modal || modal.hidden) return;
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove('modal-open');
    if(lastFocus && lastFocus.focus){ try{ lastFocus.focus({ preventScroll: true }); }catch(e){} }
    lastFocus = null;
  }

  function isPolicyLink(a){
    try{ return normPath(new URL(a.href, location.href).pathname) === POLICY_PATH; }catch(e){ return false; }
  }

  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if(!a || !isPolicyLink(a)) return;
    if(e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open().catch(function(){ window.location.href = a.href; });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modal && !modal.hidden) close();
    /* garde le focus clavier dans la fenêtre */
    if(e.key === 'Tab' && modal && !modal.hidden){
      var f = modal.querySelectorAll('button, a[href], summary, [tabindex]:not([tabindex="-1"])');
      if(!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if(e.shiftKey && (document.activeElement === first || document.activeElement === content)){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  window.KKPrivacy = { open: open, close: close };
})();
