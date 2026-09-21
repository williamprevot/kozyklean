(function(){
  "use strict";

  /* ---- placeholders à confirmer par la cliente ---- */
  var CONTACT_EMAIL = "info@kozyklean.ca";
  var CONTACT_PHONE_DISPLAY = "418 573-1793";
  var CONTACT_PHONE_TEL = "+14185731793";
  var CONTACT_PHONE_DISPLAY_2 = "581 990-7378";
  var CONTACT_PHONE_TEL_2 = "+15819907378";

  document.getElementById('phoneLink').setAttribute('href','tel:'+CONTACT_PHONE_TEL);
  document.getElementById('phoneLink').textContent = CONTACT_PHONE_DISPLAY;
  document.getElementById('phoneLink2').setAttribute('href','tel:'+CONTACT_PHONE_TEL_2);
  document.getElementById('phoneLink2').textContent = CONTACT_PHONE_DISPLAY_2;
  document.getElementById('emailLink').setAttribute('href','mailto:'+CONTACT_EMAIL);
  document.getElementById('emailLink').textContent = CONTACT_EMAIL;

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

  /* ---- indicatifs téléphoniques : tous les pays, avec autocomplétion ---- */
  var COUNTRY_CODES = [
    ["Afghanistan","+93"],["Afrique du Sud","+27"],["Albanie","+355"],["Algérie","+213"],
    ["Allemagne","+49"],["Andorre","+376"],["Angola","+244"],["Antigua-et-Barbuda","+1268"],
    ["Arabie saoudite","+966"],["Argentine","+54"],["Arménie","+374"],["Australie","+61"],
    ["Autriche","+43"],["Azerbaïdjan","+994"],["Bahamas","+1242"],["Bahreïn","+973"],
    ["Bangladesh","+880"],["Barbade","+1246"],["Belgique","+32"],["Belize","+501"],
    ["Bénin","+229"],["Bhoutan","+975"],["Biélorussie","+375"],["Birmanie (Myanmar)","+95"],
    ["Bolivie","+591"],["Bosnie-Herzégovine","+387"],["Botswana","+267"],["Brésil","+55"],
    ["Brunei","+673"],["Bulgarie","+359"],["Burkina Faso","+226"],["Burundi","+257"],
    ["Cambodge","+855"],["Cameroun","+237"],["Canada","+1"],["Cap-Vert","+238"],
    ["Chili","+56"],["Chine","+86"],["Chypre","+357"],["Colombie","+57"],
    ["Comores","+269"],["Congo-Brazzaville","+242"],["Congo (RDC)","+243"],["Corée du Nord","+850"],
    ["Corée du Sud","+82"],["Costa Rica","+506"],["Côte d'Ivoire","+225"],["Croatie","+385"],
    ["Cuba","+53"],["Danemark","+45"],["Djibouti","+253"],["Dominique","+1767"],
    ["Égypte","+20"],["Émirats arabes unis","+971"],["Équateur","+593"],["Érythrée","+291"],
    ["Espagne","+34"],["Estonie","+372"],["Eswatini","+268"],["États-Unis","+1"],
    ["USA","+1"],["Éthiopie","+251"],["Fidji","+679"],["Finlande","+358"],
    ["France","+33"],["Gabon","+241"],["Gambie","+220"],["Géorgie","+995"],
    ["Ghana","+233"],["Grèce","+30"],["Grenade","+1473"],["Guatemala","+502"],
    ["Guinée","+224"],["Guinée-Bissau","+245"],["Guinée équatoriale","+240"],["Guyana","+592"],
    ["Haïti","+509"],["Honduras","+504"],["Hong Kong","+852"],["Hongrie","+36"],
    ["Îles Marshall","+692"],["Îles Salomon","+677"],["Inde","+91"],["Indonésie","+62"],
    ["Irak","+964"],["Iran","+98"],["Irlande","+353"],["Islande","+354"],
    ["Israël","+972"],["Italie","+39"],["Jamaïque","+1876"],["Japon","+81"],
    ["Jordanie","+962"],["Kazakhstan","+7"],["Kenya","+254"],["Kirghizistan","+996"],
    ["Kiribati","+686"],["Koweït","+965"],["Laos","+856"],["Lesotho","+266"],
    ["Lettonie","+371"],["Liban","+961"],["Liberia","+231"],["Libye","+218"],
    ["Liechtenstein","+423"],["Lituanie","+370"],["Luxembourg","+352"],["Macao","+853"],
    ["Macédoine du Nord","+389"],["Madagascar","+261"],["Malaisie","+60"],["Malawi","+265"],
    ["Maldives","+960"],["Mali","+223"],["Malte","+356"],["Maroc","+212"],
    ["Maurice","+230"],["Mauritanie","+222"],["Mexique","+52"],["Micronésie","+691"],
    ["Moldavie","+373"],["Monaco","+377"],["Mongolie","+976"],["Monténégro","+382"],
    ["Mozambique","+258"],["Namibie","+264"],["Nauru","+674"],["Népal","+977"],
    ["Nicaragua","+505"],["Niger","+227"],["Nigeria","+234"],["Norvège","+47"],
    ["Nouvelle-Zélande","+64"],["Oman","+968"],["Ouganda","+256"],["Ouzbékistan","+998"],
    ["Pakistan","+92"],["Palaos","+680"],["Palestine","+970"],["Panama","+507"],
    ["Papouasie-Nouvelle-Guinée","+675"],["Paraguay","+595"],["Pays-Bas","+31"],["Pérou","+51"],
    ["Philippines","+63"],["Pologne","+48"],["Portugal","+351"],["Qatar","+974"],
    ["République centrafricaine","+236"],["République dominicaine","+1809"],["République tchèque","+420"],["Roumanie","+40"],
    ["Royaume-Uni","+44"],["Russie","+7"],["Rwanda","+250"],["Saint-Christophe-et-Niévès","+1869"],
    ["Saint-Marin","+378"],["Saint-Vincent-et-les-Grenadines","+1784"],["Sainte-Lucie","+1758"],["Salvador","+503"],
    ["Samoa","+685"],["São Tomé-et-Principe","+239"],["Sénégal","+221"],["Serbie","+381"],
    ["Seychelles","+248"],["Sierra Leone","+232"],["Singapour","+65"],["Slovaquie","+421"],
    ["Slovénie","+386"],["Somalie","+252"],["Soudan","+249"],["Soudan du Sud","+211"],
    ["Sri Lanka","+94"],["Suède","+46"],["Suisse","+41"],["Suriname","+597"],
    ["Syrie","+963"],["Taïwan","+886"],["Tadjikistan","+992"],["Tanzanie","+255"],
    ["Tchad","+235"],["Thaïlande","+66"],["Timor oriental","+670"],["Togo","+228"],
    ["Tonga","+676"],["Trinité-et-Tobago","+1868"],["Tunisie","+216"],["Turkménistan","+993"],
    ["Turquie","+90"],["Tuvalu","+688"],["Ukraine","+380"],["Uruguay","+598"],
    ["Vanuatu","+678"],["Vatican","+379"],["Venezuela","+58"],["Vietnam","+84"],
    ["Yémen","+967"],["Zambie","+260"],["Zimbabwe","+263"]
  ].sort(function(a,b){ return a[0].localeCompare(b[0], 'fr'); });

  var indicatifSelectEl = document.getElementById('indicatif');
  if(indicatifSelectEl){
    var ogFreq = document.createElement('optgroup');
    ogFreq.label = 'Fréquents';
    [["Canada","+1"],["États-Unis","+1"]].forEach(function(c){
      var opt = document.createElement('option');
      opt.value = c[1];
      opt.textContent = c[0] + ' (' + c[1] + ')';
      if(c[0] === 'Canada') opt.selected = true;
      ogFreq.appendChild(opt);
    });
    indicatifSelectEl.appendChild(ogFreq);
    var ogAll = document.createElement('optgroup');
    ogAll.label = 'Tous les pays';
    COUNTRY_CODES.forEach(function(c){
      var opt = document.createElement('option');
      opt.value = c[1];
      opt.textContent = c[0] + ' (' + c[1] + ')';
      ogAll.appendChild(opt);
    });
    indicatifSelectEl.appendChild(ogAll);
  }

  /* ---- zones data (secteurs desservis, du centre vers la périphérie) ---- */
  var ZONES = [
    {
      id: '1', title: 'Zone 1 · Secteur central', price: 'Aucun supplément',
      note: "Zone 1 : aucun frais de déplacement. Minimum de facturation : 1 heure.",
      cities: ['Sainte-Foy', 'Sillery', 'Cap-Rouge', 'Québec (centre-ville)', "L'Ancienne-Lorette", 'Loretteville']
    },
    {
      id: '2', title: 'Zone 2 · Grande région de Québec', price: 'Léger supplément',
      note: "Zone 2 : léger supplément de déplacement applicable. Minimum de facturation : 1 heure.",
      cities: ['Charlesbourg', 'Beauport', 'Val-Bélair', 'Saint-Augustin-de-Desmaures', 'Lévis (secteurs proches)']
    },
    {
      id: '3', title: 'Zone 3 · Périphérie élargie', price: 'Supplément selon la distance',
      note: "Zone 3 : supplément de déplacement applicable selon la distance. Minimum de facturation : 1 heure.",
      cities: ['Lévis (secteurs éloignés)', 'Donnacona', 'Pont-Rouge', 'Shannon', 'Neuville']
    },
    {
      id: '4', title: 'Déplacement exceptionnel', price: 'Sur devis',
      note: "Déplacement exceptionnel : frais calculés selon la distance et convenus avec vous. Minimum de facturation : 1 heure.",
      cities: ['Portneuf', 'Charlevoix', 'Côte-de-Beaupré']
    }
  ];
  var ZONE_NOTES = {};
  ZONES.forEach(function(z){ ZONE_NOTES[z.id] = z.note; });

  /* ---- ville -> zone (déduit silencieusement pour le formulaire, et pour le vérificateur) ---- */
  function kkNormalizeCity(s){
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/^st(e)?[\s-]/,'saint$1 ').trim();
  }
  var kkCityMap = [];
  ZONES.forEach(function(z){
    z.cities.forEach(function(c){
      var name = c.replace(/\(.*?\)/g, '').trim();
      if(name) kkCityMap.push({ norm: kkNormalizeCity(name), label: name, zone: z });
    });
  });
  function kkFindCity(raw){
    if(!raw) return null;
    var q = kkNormalizeCity(raw);
    return kkCityMap.find(function(c){ return c.norm === q; })
      || kkCityMap.find(function(c){ return c.norm.indexOf(q) !== -1 || q.indexOf(c.norm) !== -1; });
  }
  function kkZoneForCity(raw){
    var found = kkFindCity(raw);
    return found ? found.zone.id : null;
  }
  var villeInput = document.getElementById('ville');
  var villeListEl = document.getElementById('villeList');
  if(villeListEl){
    kkCityMap.forEach(function(c){
      var opt = document.createElement('option');
      opt.value = c.label;
      villeListEl.appendChild(opt);
    });
  }

  /* ---- fréquence : révèle un champ libre pour "Sur mesure" ---- */
  var freqAutreField = document.getElementById('freqAutreField');
  var freqAutreTexte = document.getElementById('freqAutreTexte');
  document.querySelectorAll('input[name="frequence"]').forEach(function(r){
    r.addEventListener('change', function(){
      if(freqAutreField) freqAutreField.hidden = (r.value !== 'Sur mesure');
    });
  });

  /* ---- wizard ---- */
  var STEP_LABELS = ["Vos coordonnées","Vos besoins","Votre résidence","Le rythme qui vous convient","Derniers détails"];
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
  function isValidPhone(v, code){
    var digits = v.replace(/\D/g, '');
    if(code === '+1' || !code){
      if(digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
      if(digits.length !== 10) return false;
      /* format nord-américain réel : indicatif régional et code d'échange ne commencent pas par 0 ou 1 */
      return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
    }
    /* indicatifs internationaux : la disposition des chiffres varie selon le pays,
       on accepte une plage large plutôt que d'imposer le format nord-américain */
    return digits.length >= 6 && digits.length <= 15;
  }
  function setFieldError(fieldId, hasError){
    var field = document.getElementById(fieldId);
    if(field) field.classList.toggle('has-error', hasError);
  }
  function validateCoordonnees(){
    var nom = document.getElementById('nom').value.trim();
    var tel = document.getElementById('tel').value.trim();
    var indicatif = document.getElementById('indicatif').value;
    var courriel = document.getElementById('courriel').value.trim();
    var telOk = !tel || isValidPhone(tel, indicatif);
    var courrielOk = !courriel || isValidEmail(courriel);
    setFieldError('telField', !!tel && !telOk);
    setFieldError('courrielField', !!courriel && !courrielOk);
    var hasContact = (!!tel && telOk) || (!!courriel && courrielOk);
    return { ok: !!nom && telOk && courrielOk && hasContact, telOk: telOk, courrielOk: courrielOk };
  }
  var telInput = document.getElementById('tel');
  var indicatifSelect = document.getElementById('indicatif');
  var courrielInput = document.getElementById('courriel');
  if(telInput) telInput.addEventListener('blur', function(){
    var v = this.value.trim();
    setFieldError('telField', !!v && !isValidPhone(v, indicatifSelect.value));
  });
  if(courrielInput) courrielInput.addEventListener('blur', function(){
    var v = this.value.trim();
    setFieldError('courrielField', !!v && !isValidEmail(v));
  });

  function stepOk(n){
    if(n === 1){
      return validateCoordonnees().ok;
    }
    return true;
  }

  wizNext.addEventListener('click', function(){
    if(currentStep === 1){
      var v1 = validateCoordonnees();
      if(!v1.ok){
        formError.textContent = !v1.telOk
          ? "Le numéro de téléphone saisi semble invalide."
          : !v1.courrielOk
          ? "L'adresse courriel saisie semble invalide."
          : "Merci d'indiquer votre nom et un moyen de vous joindre (téléphone ou courriel).";
        formError.style.display = 'block';
        return;
      }
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
    var indicatif = document.getElementById('indicatif').value;
    var courriel = document.getElementById('courriel').value.trim();
    var adresse = document.getElementById('adresse').value.trim();
    var appartement = document.getElementById('appartement').value.trim();
    var ville = document.getElementById('ville').value.trim();
    var codePostal = document.getElementById('codePostal').value.trim();
    var typeResidence = document.getElementById('typeResidence').value;
    var chambres = document.getElementById('chambres').value;
    var sdb = document.getElementById('sdb').value;
    var attentes = document.getElementById('attentes').value.trim();
    var frequenceEl = form.querySelector('input[name="frequence"]:checked');
    var frequenceTxt = frequenceEl.value === 'Sur mesure' && freqAutreTexte.value.trim()
      ? "Sur mesure (" + freqAutreTexte.value.trim() + ")"
      : frequenceEl.value;
    var interets = Array.prototype.slice.call(form.querySelectorAll('input[name="interet"]:checked')).map(function(el){ return el.value; });
    var dateDebut = document.getElementById('dateDebut').value;
    var notes = document.getElementById('notes').value.trim();
    var consent = document.getElementById('consent').checked;

    if(!nom || (!tel && !courriel)){
      currentStep = 1; showStep(1);
      formError.textContent = "Merci d'indiquer votre nom et un moyen de vous joindre (téléphone ou courriel).";
      formError.style.display = 'block';
      return;
    }
    if(!consent){
      formError.textContent = "Merci de cocher la case d'autorisation pour finaliser votre demande.";
      formError.style.display = 'block';
      return;
    }
    formError.style.display = 'none';

    var zoneNum = kkZoneForCity(ville) || 1;
    var zoneTxt = ZONE_NOTES[zoneNum];

    var lines = [];
    lines.push("Kozy & Klean : nouvelle demande de soumission");
    lines.push("");
    lines.push("Nom : " + nom);
    if(tel) lines.push("Téléphone : " + (indicatif ? indicatif + " " : "") + tel);
    if(courriel) lines.push("Courriel : " + courriel);
    lines.push("");
    if(interets.length) lines.push("Services qui l'intéressent : " + interets.join(", "));
    lines.push("Précisions exprimées : " + (attentes || "Non précisées — à discuter ensemble."));
    lines.push("");
    if(adresse) lines.push("Adresse : " + adresse + (appartement ? ", " + appartement : ""));
    if(ville) lines.push("Ville : " + ville + (codePostal ? " (" + codePostal + ")" : ""));
    lines.push(zoneTxt);
    lines.push("Type de résidence : " + typeResidence + " · " + chambres + " ch. · " + sdb + " sdb.");
    lines.push("");
    lines.push("Fréquence souhaitée : " + frequenceTxt);
    if(dateDebut) lines.push("Date de début souhaitée : " + dateDebut);
    if(notes) lines.push("Précisions additionnelles : " + notes);
    lines.push("");
    lines.push("La cliente autorise Kozy & Klean à la contacter pour finaliser la soumission et le contrat de service.");

    var body = lines.join("\n");
    resumeBody.textContent = body;
    resumePanel.style.display = 'block';

    var mailSubject = "Demande de soumission de " + nom;
    document.getElementById('mailBtn').setAttribute('href',
      "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(mailSubject) + "&body=" + encodeURIComponent(body));

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

  /* ---- "Ce que l'on fait" : onglets + carrousel des catégories de services ---- */
  (function(){
    var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>';

    var CATS = [
      {
        title:'Entretien résidentiel',
        tag:"Le ménage, fait sérieusement",
        icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="13" width="9" height="7" rx="2"/><circle cx="5.5" cy="20.5" r="1"/><circle cx="9.5" cy="20.5" r="1"/><path d="M12 15c5 0 7-3 7-8"/><path d="M19 7l2.2-1.3"/></svg>',
        bullets:['Ménage complet, cuisine séjour et salle de bain','Lessive, repassage et literie','Vitres et surfaces du quotidien']
      },
      {
        title:'Soins spécialisés',
        tag:"Tout ce que l'entretien régulier ne couvre pas",
        icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/></svg>',
        bullets:['Nettoyage en profondeur, électroménagers','Tapis et literies à la vapeur','Grand ménage saisonnier ou événementiel']
      },
      {
        title:'Organisation &amp; optimisation',
        tag:'Votre espace repensé pour vous simplifier la vie',
        icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
        desc:"Un regard neuf sur vos espaces de vie, les rendront plus fonctionnels."
      },
      {
        title:'Soutien &amp; accompagnement',
        tag:'Déléguez ce qui consume votre temps',
        icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2.2 0 3.5 1.3 4 2 .5-.7 1.8-2 4-2 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>',
        bullets:['Coordination de tâches sur mesure','Commissions, courses, livraisons','Soutien familial à domicile']
      },
      {
        title:'Suivi en votre absence',
        tag:"Votre résidence surveillée, même à distance",
        icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>',
        bullets:['Vérifications et sécurité du domicile','Résidence secondaire ou saisonnière','Comptes rendus avec photos, à distance']
      }
    ];

    var tabsStrip = document.getElementById('offerTabs');
    var track = document.getElementById('offerTrack');
    var dotsEl = document.getElementById('offerDots');
    if(!tabsStrip || !track || !dotsEl) return;

    var current = 0;

    function bulletsHtml(cat){
      if(cat.bullets){
        return '<ul>' + cat.bullets.map(function(b){ return '<li>'+CHECK+'<span>'+b+'</span></li>'; }).join('') + '</ul>';
      }
      return '<p class="desc-only">'+cat.desc+'</p>';
    }

    CATS.forEach(function(cat, i){
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab-btn' + (i===0 ? ' is-on' : '');
      tab.setAttribute('role','tab');
      tab.innerHTML = cat.icon + '<span>' + cat.title + '</span>';
      tab.addEventListener('click', function(){ goTo(i); });
      tabsStrip.appendChild(tab);

      var slide = document.createElement('div');
      slide.className = 'car-slide' + (i===0 ? ' is-on' : '');
      slide.setAttribute('role','tabpanel');
      slide.innerHTML =
        '<div class="car-head">' +
          '<div class="car-icon">'+cat.icon+'</div>' +
          '<div class="car-head-text"><h3>'+cat.title+'</h3><div class="car-tag">'+cat.tag+'</div></div>' +
        '</div>' +
        bulletsHtml(cat);
      track.appendChild(slide);

      var dot = document.createElement('span');
      dot.className = 'car-dot' + (i===0 ? ' is-on' : '');
      dot.addEventListener('click', function(){ goTo(i); });
      dotsEl.appendChild(dot);
    });

    function goTo(i){
      current = (i + CATS.length) % CATS.length;
      Array.prototype.forEach.call(tabsStrip.children, function(el, idx){ el.classList.toggle('is-on', idx===current); });
      Array.prototype.forEach.call(track.children, function(el, idx){ el.classList.toggle('is-on', idx===current); });
      Array.prototype.forEach.call(dotsEl.children, function(el, idx){ el.classList.toggle('is-on', idx===current); });
      var activeTab = tabsStrip.children[current];
      if(activeTab){
        /* défilement horizontal du bandeau d'onglets seulement — jamais la page entière */
        var targetLeft = activeTab.offsetLeft - (tabsStrip.clientWidth - activeTab.offsetWidth) / 2;
        var maxLeft = tabsStrip.scrollWidth - tabsStrip.clientWidth;
        targetLeft = Math.max(0, Math.min(targetLeft, maxLeft));
        if(tabsStrip.scrollTo) tabsStrip.scrollTo({left:targetLeft, behavior:'smooth'});
        else tabsStrip.scrollLeft = targetLeft;
      }
    }
    var prevBtn = document.getElementById('offerPrev');
    var nextBtn = document.getElementById('offerNext');
    if(prevBtn) prevBtn.addEventListener('click', function(){ goTo(current-1); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ goTo(current+1); });

    /* balayement automatique, à l'image de la récurrence */
    var offerReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var offerTimer = null;
    function offerStart(){ if(!offerReduce && !offerTimer) offerTimer = setInterval(function(){ goTo(current+1); }, 5500); }
    function offerStop(){ clearInterval(offerTimer); offerTimer = null; }
    if(!offerReduce) offerStart();
    var offerCarouselEl = document.querySelector('#services .offer-carousel');
    [tabsStrip, offerCarouselEl, dotsEl].forEach(function(el){
      if(!el) return;
      el.addEventListener('mouseenter', offerStop);
      el.addEventListener('mouseleave', offerStart);
      el.addEventListener('focusin', offerStop);
      el.addEventListener('focusout', function(e){ if(!el.contains(e.relatedTarget)) offerStart(); });
    });

    /* fondu au bord droit uniquement si les onglets débordent réellement */
    function updateTabsOverflow(){
      tabsStrip.classList.toggle('is-scrollable', tabsStrip.scrollWidth - tabsStrip.clientWidth > 4);
    }
    updateTabsOverflow();
    window.addEventListener('resize', updateTabsOverflow);
    tabsStrip.addEventListener('scroll', function(){
      var atEnd = tabsStrip.scrollWidth - tabsStrip.clientWidth - tabsStrip.scrollLeft <= 4;
      tabsStrip.classList.toggle('is-scrollable', !atEnd && tabsStrip.scrollWidth - tabsStrip.clientWidth > 4);
    });
  })();

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
  ['.sec-head','.offer-tabs','.offer-carousel','.pillar','.step','.sf-item','.freq-tile','.contact-row'].forEach(function(sel){
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
  autoCycle('#freqRow', '.freq-tile', 3600);

  /* ---- vérificateur de secteur ---- */
  (function(){
    var checkInput = document.getElementById('zoneCheckInput');
    var checkBtn = document.getElementById('zoneCheckBtn');
    var checkResult = document.getElementById('zoneCheckResult');
    if(!checkInput || !checkBtn || !checkResult) return;

    function runCheck(opts){
      var raw = checkInput.value.trim();
      var live = opts && opts.live;
      if(!raw){ checkResult.textContent = ''; checkResult.classList.remove('is-found'); return; }
      if(live && raw.length < 2){ checkResult.textContent = ''; checkResult.classList.remove('is-found'); return; }
      var found = kkFindCity(raw);
      if(found){
        checkResult.innerHTML = found.label + ' se trouve en <b>' + found.zone.title + '</b> — ' + found.zone.price + '.';
        checkResult.classList.add('is-found');
      } else {
        checkResult.innerHTML = 'Secteur non reconnu — laissez-nous vos coordonnées dans le <a href="#simulateur" style="color:var(--ink);border-bottom:1px solid var(--gold);text-decoration:none;">simulateur</a>, on confirmera votre zone.';
        checkResult.classList.remove('is-found');
      }
    }
    checkBtn.addEventListener('click', function(){ runCheck(); });
    checkInput.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); runCheck(); } });
    var liveTimer;
    checkInput.addEventListener('input', function(){
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function(){ runCheck({live:true}); }, 350);
    });
  })();

})();