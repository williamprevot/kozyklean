(function(){
  "use strict";

  /* ---- placeholders à confirmer par la cliente ---- */
  var CONTACT_EMAIL = "info@kozyklean.ca";
  var CONTACT_PHONE_DISPLAY = "418 573-1793";
  var CONTACT_PHONE_TEL = "+14185731793";
  var CONTACT_PHONE_DISPLAY_2 = "581 990-7378";
  var CONTACT_PHONE_TEL_2 = "+15819907378";
  var CONTACT_WHATSAPP = "14180000000";

  document.getElementById('phoneLink').setAttribute('href','tel:'+CONTACT_PHONE_TEL);
  document.getElementById('phoneLink').textContent = CONTACT_PHONE_DISPLAY;
  document.getElementById('phoneLink2').setAttribute('href','tel:'+CONTACT_PHONE_TEL_2);
  document.getElementById('phoneLink2').textContent = CONTACT_PHONE_DISPLAY_2;
  document.getElementById('emailLink').setAttribute('href','mailto:'+CONTACT_EMAIL);
  document.getElementById('emailLink').textContent = CONTACT_EMAIL;
  document.getElementById('waLink').setAttribute('href','https://wa.me/'+CONTACT_WHATSAPP);

  /* ---- année du copyright, toujours à jour ---- */
  var copyYearEl = document.getElementById('copyYear');
  if(copyYearEl){ copyYearEl.textContent = new Date().getFullYear(); }

  /* ---- mobile menu ---- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  menuBtn.addEventListener('click', function(){
    var open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true':'false');
  });
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mobileNav.classList.remove('open'); });
  });

  /* ---- zones data ---- */
  var ZONES = [
    { zone:1, label:"Zone 1 : secteur central (aucun frais de déplacement)",
      places:["Sainte-Foy","Sillery","Cap-Rouge","Québec – Centre-ville / Vieux-Québec","Saint-Sacrement / Montcalm","L'Ancienne-Lorette","Loretteville"] },
    { zone:2, label:"Zone 2 : grande région de Québec (supplément modéré)",
      places:["Charlesbourg","Beauport","Val-Bélair","Neufchâtel","Saint-Augustin-de-Desmaures","Lévis – Charny / Saint-Romuald"] },
    { zone:3, label:"Zone 3 : périphérie élargie (supplément selon distance)",
      places:["Lévis – secteurs éloignés","Boischâtel / L'Ange-Gardien","Shannon / Saint-Gabriel-de-Valcartier","Donnacona / Pont-Rouge","Neuville"] },
    { zone:4, label:"Déplacement exceptionnel (sur demande)",
      places:["Portneuf","Charlevoix (Baie-Saint-Paul et environs)","Côte-de-Beaupré – secteurs éloignés","Montmagny / Lotbinière","Autre secteur, à préciser"] }
  ];
  var ZONE_NOTES = {
    1: "Zone 1 : aucun frais de déplacement. Minimum de facturation : 1 heure.",
    2: "Zone 2 : léger supplément de déplacement applicable. Minimum de facturation : 1 heure.",
    3: "Zone 3 : supplément de déplacement applicable selon la distance. Minimum de facturation : 1 heure.",
    4: "Déplacement exceptionnel : frais calculés selon la distance et convenus avec vous. Minimum de facturation : 1 heure."
  };

  var secteurSelect = document.getElementById('secteur');
  var placeToZone = {};
  ZONES.forEach(function(z){
    var og = document.createElement('optgroup');
    og.label = z.label;
    z.places.forEach(function(p){
      var opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      og.appendChild(opt);
      placeToZone[p] = z.zone;
    });
    secteurSelect.appendChild(og);
  });

  var zoneNote = document.getElementById('zoneNote');
  function updateZoneNote(){
    var z = placeToZone[secteurSelect.value] || 1;
    zoneNote.textContent = ZONE_NOTES[z];
    zoneNote.className = 'zone-note' + (z >= 3 ? ' warn' : '');
  }
  secteurSelect.addEventListener('change', updateZoneNote);
  updateZoneNote();

  /* ---- wizard ---- */
  var STEP_LABELS = ["Vos coordonnées","Votre résidence","Votre formule","Fréquence souhaitée","Services complémentaires","Derniers détails"];
  var totalSteps = STEP_LABELS.length;
  var currentStep = 1;
  var steps = Array.prototype.slice.call(document.querySelectorAll('.wizard-step'));
  var wpFill = document.getElementById('wpFill');
  var wpLabel = document.getElementById('wpLabel');
  var wizBack = document.getElementById('wizBack');
  var wizNext = document.getElementById('wizNext');
  var wizSubmit = document.getElementById('wizSubmit');
  var formError = document.getElementById('formError');

  function showStep(n){
    steps.forEach(function(s){ s.hidden = (parseInt(s.dataset.step,10) !== n); });
    wpFill.style.width = Math.round((n/totalSteps)*100) + '%';
    wpLabel.textContent = "Étape " + n + " sur " + totalSteps + " : " + STEP_LABELS[n-1];
    wizBack.disabled = (n === 1);
    wizNext.hidden = (n === totalSteps);
    wizSubmit.hidden = (n !== totalSteps);
    formError.style.display = 'none';
  }

  /* ---- coordonnées: phone / email format checks ---- */
  function isValidEmail(v){
    /* format complet: partie locale + @ + domaine avec au moins un point, pas de points doubles/en bordure */
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(v)
      && v.indexOf('..') === -1;
  }
  function isValidPhone(v){
    var digits = v.replace(/\D/g, '');
    if(digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
    if(digits.length !== 10) return false;
    /* format nord-américain réel : indicatif régional et code d'échange ne commencent pas par 0 ou 1 */
    return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
  }
  function setFieldError(fieldId, hasError){
    var field = document.getElementById(fieldId);
    if(field) field.classList.toggle('has-error', hasError);
  }
  function validateCoordonnees(){
    var nom = document.getElementById('nom').value.trim();
    var tel = document.getElementById('tel').value.trim();
    var courriel = document.getElementById('courriel').value.trim();
    var telOk = !tel || isValidPhone(tel);
    var courrielOk = !courriel || isValidEmail(courriel);
    setFieldError('telField', !!tel && !telOk);
    setFieldError('courrielField', !!courriel && !courrielOk);
    var hasContact = (!!tel && telOk) || (!!courriel && courrielOk);
    return { ok: !!nom && telOk && courrielOk && hasContact, telOk: telOk, courrielOk: courrielOk };
  }
  var telInput = document.getElementById('tel');
  var courrielInput = document.getElementById('courriel');
  if(telInput) telInput.addEventListener('blur', function(){
    var v = this.value.trim();
    setFieldError('telField', !!v && !isValidPhone(v));
  });
  if(courrielInput) courrielInput.addEventListener('blur', function(){
    var v = this.value.trim();
    setFieldError('courrielField', !!v && !isValidEmail(v));
  });

  function stepOk(n){
    if(n === 1){
      return validateCoordonnees().ok;
    }
    if(n === 3){
      return !!document.querySelector('input[name="formule"]:checked');
    }
    return true;
  }

  wizNext.addEventListener('click', function(){
    if(currentStep === 1){
      var v1 = validateCoordonnees();
      if(!v1.ok){
        formError.textContent = !v1.telOk
          ? "Le numéro de téléphone saisi semble invalide (10 chiffres attendus)."
          : !v1.courrielOk
          ? "L'adresse courriel saisie semble invalide."
          : "Merci d'indiquer votre nom et un moyen de vous joindre (téléphone ou courriel).";
        formError.style.display = 'block';
        return;
      }
    } else if(!stepOk(currentStep)){
      formError.textContent = "Merci de choisir une formule pour continuer.";
      formError.style.display = 'block';
      return;
    }
    if(currentStep < totalSteps){ currentStep++; showStep(currentStep); }
  });
  wizBack.addEventListener('click', function(){
    if(currentStep > 1){ currentStep--; showStep(currentStep); }
  });
  showStep(currentStep);

  /* ---- form submit ---- */
  var form = document.getElementById('quoteForm');
  var resumePanel = document.getElementById('resumePanel');
  var resumeBody = document.getElementById('resumeBody');

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var nom = document.getElementById('nom').value.trim();
    var tel = document.getElementById('tel').value.trim();
    var courriel = document.getElementById('courriel').value.trim();
    var secteur = secteurSelect.value;
    var adresse = document.getElementById('adresse').value.trim();
    var typeResidence = document.getElementById('typeResidence').value;
    var chambres = document.getElementById('chambres').value;
    var sdb = document.getElementById('sdb').value;
    var formuleEl = form.querySelector('input[name="formule"]:checked');
    var frequenceEl = form.querySelector('input[name="frequence"]:checked');
    var addons = Array.prototype.slice.call(form.querySelectorAll('input[name="addon"]:checked')).map(function(el){ return el.value; });
    var dateDebut = document.getElementById('dateDebut').value;
    var notes = document.getElementById('notes').value.trim();
    var consent = document.getElementById('consent').checked;

    if(!nom || (!tel && !courriel)){
      currentStep = 1; showStep(1);
      formError.textContent = "Merci d'indiquer votre nom et un moyen de vous joindre (téléphone ou courriel).";
      formError.style.display = 'block';
      return;
    }
    if(!formuleEl){
      currentStep = 3; showStep(3);
      formError.textContent = "Merci de choisir une formule pour continuer.";
      formError.style.display = 'block';
      return;
    }
    if(!consent){
      formError.textContent = "Merci de cocher la case d'autorisation pour finaliser votre demande.";
      formError.style.display = 'block';
      return;
    }
    formError.style.display = 'none';

    var zoneTxt = ZONE_NOTES[placeToZone[secteur] || 1];

    var lines = [];
    lines.push("Kozy & Klean : nouvelle demande de soumission");
    lines.push("");
    lines.push("Nom : " + nom);
    if(tel) lines.push("Téléphone : " + tel);
    if(courriel) lines.push("Courriel : " + courriel);
    lines.push("");
    lines.push("Secteur : " + secteur);
    if(adresse) lines.push("Adresse : " + adresse);
    lines.push(zoneTxt);
    lines.push("Type de résidence : " + typeResidence + " · " + chambres + " ch. · " + sdb + " sdb.");
    lines.push("");
    lines.push("Formule souhaitée : " + formuleEl.value);
    lines.push("Fréquence souhaitée : " + frequenceEl.value);
    if(addons.length) lines.push("Services complémentaires : " + addons.join(", "));
    if(dateDebut) lines.push("Date de début souhaitée : " + dateDebut);
    if(notes) lines.push("Précisions : " + notes);
    lines.push("");
    lines.push("La cliente autorise Kozy & Klean à la contacter pour finaliser la soumission et le contrat de service.");

    var body = lines.join("\n");
    resumeBody.textContent = body;
    resumePanel.style.display = 'block';

    var mailSubject = "Demande de soumission de " + nom;
    document.getElementById('mailBtn').setAttribute('href',
      "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(mailSubject) + "&body=" + encodeURIComponent(body));
    document.getElementById('waBtn').setAttribute('href',
      "https://wa.me/" + CONTACT_WHATSAPP + "?text=" + encodeURIComponent(body));

    resumePanel.scrollIntoView({behavior:'smooth', block:'start'});
  });

  document.getElementById('printBtn').addEventListener('click', function(){
    window.print();
  });

  /* ---- quick message box ---- */
  document.getElementById('qSend').addEventListener('click', function(){
    var nom = document.getElementById('qNom').value.trim();
    var contact = document.getElementById('qTel').value.trim();
    var msg = document.getElementById('qMsg').value.trim();
    if(!nom || !contact || !msg){
      alert("Merci d'indiquer votre nom, un moyen de vous joindre et votre message.");
      return;
    }
    var body = "Message rapide du site Kozy & Klean\n\nNom : " + nom + "\nCoordonnées : " + contact + "\n\nMessage :\n" + msg;
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Message rapide de " + nom) + "&body=" + encodeURIComponent(body);
  });

  /* ---- reveal on scroll, staggered ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var d = en.target.dataset.revealDelay || 0;
        en.target.style.animationDelay = d + 'ms';
        en.target.classList.add('reveal');
        io.unobserve(en.target);
      }
    });
  }, {threshold:0.12});
  ['.sec-head','.fcard','.pillar','.step','.service-cat','.method-row','.freq-tile','.zone-row','.contact-row'].forEach(function(sel){
    Array.prototype.slice.call(document.querySelectorAll(sel)).forEach(function(el, i){
      el.dataset.revealDelay = Math.min(i * 60, 300);
      io.observe(el);
    });
  });

  /* ---- sticky nav shadow on scroll ---- */
  var navEl = document.querySelector('header.nav');
  function onScroll(){
    if(window.scrollY > 8){ navEl.style.boxShadow = '0 8px 24px -18px rgba(43,37,33,0.4)'; }
    else { navEl.style.boxShadow = 'none'; }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- bouton "Soumission gratuite" du menu : visible seulement quand le bouton du hero est hors écran ---- */
  var heroCtaEl = document.getElementById('heroCta');
  if(heroCtaEl && 'IntersectionObserver' in window){
    var heroCtaObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        document.body.classList.toggle('show-nav-cta', !entry.isIntersecting);
      });
    }, {threshold:0});
    heroCtaObserver.observe(heroCtaEl);
  }

  /* ---- gentle auto-highlight: steps, formula cards, frequency tiles, one at a time.
     Hovering, clicking or focusing an item jumps the glow straight to it and pauses
     the cycle; it resumes once the pointer/focus leaves the whole group. ---- */
  function autoCycle(containerSel, itemSel, ms){
    var container = document.querySelector(containerSel);
    if(!container) return;
    var items = Array.prototype.slice.call(container.querySelectorAll(itemSel));
    if(items.length < 2) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idx = items.findIndex(function(el){ return el.classList.contains('is-active'); });
    if(idx < 0) idx = 0;
    var timer = null;
    function setActive(newIdx){
      if(newIdx === idx) return;
      items[idx].classList.remove('is-active');
      idx = newIdx;
      items[idx].classList.add('is-active');
    }
    function advance(){ setActive((idx + 1) % items.length); }
    function start(){ if(!reduceMotion && !timer) timer = setInterval(advance, ms); }
    function stop(){ clearInterval(timer); timer = null; }
    if(!reduceMotion) start();
    container.addEventListener('mouseleave', start);
    container.addEventListener('focusout', function(e){
      if(!container.contains(e.relatedTarget)) start();
    });
    items.forEach(function(item, i){
      item.addEventListener('mouseenter', function(){ stop(); setActive(i); });
      item.addEventListener('focus', function(){ stop(); setActive(i); });
      item.addEventListener('click', function(){ stop(); setActive(i); });
    });
  }
  autoCycle('#approchSteps', '.step', 3200);
  autoCycle('#formulaCards', '.fcard', 4000);
  autoCycle('#freqRow', '.freq-tile', 3600);

})();
