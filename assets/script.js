(function(){
  "use strict";

  /* ---- placeholders à confirmer par la cliente ---- */
  var CONTACT_EMAIL = "kozyklean.info@gmail.com";
  var CONTACT_PHONE_DISPLAY = "418 573-1793";
  var CONTACT_PHONE_TEL = "+14185731793";
  var CONTACT_PHONE_DISPLAY_2 = "581 990-7378";
  var CONTACT_PHONE_TEL_2 = "+15819907378";

  /* ---- EmailJS : envoi automatique des formulaires (voir EMAILJS_README.md) ----
     Tant que ces 4 valeurs commencent par "COLLEZ_", le site retombe sur
     l'ancien comportement (lien mailto:) pour ne jamais bloquer un visiteur. */
  var EMAILJS_PUBLIC_KEY = "CLPYUUArp93rNVqgy";
  var EMAILJS_SERVICE_ID = "service_rwamaur";
  var EMAILJS_TEMPLATE_NOTIF = "template_w8n3cbr";     /* envoyé à Kozy & Klean */
  var EMAILJS_TEMPLATE_AUTOREPLY = "template_4fe9y4g"; /* copie envoyée au client */

  var emailjsReady = false;
  if(window.emailjs && EMAILJS_PUBLIC_KEY.indexOf('COLLEZ_') !== 0){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailjsReady = true;
  }

  /* ---- mesure d'audience (Microsoft Clarity via assets/consent.js) ----
     N'envoie RIEN tant que le visiteur n'a pas accepté dans la bannière de
     consentement. Seuls des noms d'étapes sont transmis, jamais le contenu
     des formulaires. */
  function kkTrack(name){
    if(window.KKConsent && typeof window.KKConsent.track === 'function') window.KKConsent.track(name);
  }

  /* ---- langue de la page ----
     Déterminée une fois pour toutes par l'attribut lang de <html> (fr / en / es),
     chaque version linguistique du site étant une page HTML distincte
     (/, /en/, /es/). Le français reste la langue de repli si jamais l'attribut
     est absent ou inattendu. Le courriel envoyé à la conciergerie (Kozy & Klean)
     reste TOUJOURS en français, quelle que soit la page visitée : voir
     buildBusinessBody() plus bas, qui n'utilise jamais LANG. Seuls l'affichage
     à l'écran et le courriel de confirmation envoyé à la cliente s'adaptent à LANG. */
  var LANG = (document.documentElement.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase();
  if(['fr', 'en', 'es'].indexOf(LANG) === -1) LANG = 'fr';
  var LOCALE_TAG = { fr: 'fr', en: 'en', es: 'es' };

  /* ---- textes d'interface, par langue ---- */
  var STR = {
    fr: {
      stepLabels: ["Vos coordonnées", "Vos besoins", "Votre résidence", "Le rythme qui vous convient", "Derniers détails"],
      stepProgress: function(n, total, label){ return "Étape " + n + " sur " + total + " : " + label; },
      errPhoneInvalid: "Le numéro de téléphone saisi semble invalide.",
      errEmailInvalid: "L'adresse courriel saisie semble invalide.",
      errNameContact: "Merci d'indiquer votre nom et un moyen de vous joindre (téléphone ou courriel).",
      errConsent: "Merci de cocher la case d'autorisation pour finaliser votre demande.",
      emailSuggest: function(s){ return "Vouliez-vous dire " + s + " ?"; },
      loadingPrep: "Préparation de votre soumission...",
      loadingSend: "Envoi de votre soumission...",
      loadingMsg: "Envoi de votre message...",
      sendBtnDefault: "Envoyer ma soumission",
      sendBtnSending: "Envoi en cours...",
      sendBtnSent: "✓ Soumission envoyée",
      sendBtnRetry: "Réessayer l'envoi",
      statusNotConfigured: "L'envoi automatique n'est pas encore branché sur ce site. Utilisez le lien ci-dessous pour l'instant.",
      statusSendFailed: "L'envoi automatique n'a pas fonctionné. Vous pouvez réessayer, ou utiliser le lien ci-dessous.",
      successDefaultTitle: "Soumission envoyée !",
      successOkWithEmail: function(quoteId, email){ return "Votre soumission n° " + quoteId + " vous a été transmise à " + email + "."; },
      successOkWithPhone: function(quoteId, phone){ return "Votre soumission n° " + quoteId + " a été reçue. Nous vous recontacterons au " + phone + "."; },
      quickAlertMissing: "Merci d'indiquer votre nom, un moyen de vous joindre et votre message.",
      quickSuccessTitle: "Message envoyé !",
      quickSuccessMsg: function(msgId){ return "Votre message n° " + msgId + " a été transmis. On vous recontacte bientôt."; },
      labelQuoteNumber: "N° de soumission :",
      labelPhone: "Téléphone :",
      labelServicesInterested: "Services qui vous intéressent :",
      labelPrecisions: "Précisions exprimées :",
      noneSpecified: "Non précisées — à discuter ensemble.",
      labelAddress: "Adresse :",
      labelCity: "Ville :",
      labelResidenceType: "Type de résidence :",
      bedroomsSuffix: "ch.",
      bathroomsSuffix: "sdb.",
      labelFrequency: "Fréquence souhaitée :",
      labelStartDate: "Date de début souhaitée :",
      labelAdditionalNotes: "Précisions additionnelles :",
      otherPrefix: "Autre (",
      customFreqPrefix: "Sur mesure (",
      zoneCheckerFound: function(cityLabel, zoneTitle, zonePrice){ return cityLabel + ' se trouve en <b>' + zoneTitle + '</b> — ' + zonePrice + '.'; },
      zoneCheckerNotFound: 'Secteur non reconnu — laissez-nous vos coordonnées dans le <a href="#simulateur" style="color:var(--ink);border-bottom:1px solid var(--gold);text-decoration:none;">simulateur</a>, on confirmera votre zone.',
      countryFrequent: 'Fréquents',
      countryAll: 'Tous les pays'
    },
    en: {
      stepLabels: ["Your contact info", "Your needs", "Your home", "The pace that suits you", "Last details"],
      stepProgress: function(n, total, label){ return "Step " + n + " of " + total + ": " + label; },
      errPhoneInvalid: "The phone number you entered looks invalid.",
      errEmailInvalid: "The email address you entered looks invalid.",
      errNameContact: "Please provide your name and a way to reach you (phone or email).",
      errConsent: "Please check the consent box to submit your request.",
      emailSuggest: function(s){ return "Did you mean " + s + "?"; },
      loadingPrep: "Preparing your quote request...",
      loadingSend: "Sending your quote request...",
      loadingMsg: "Sending your message...",
      sendBtnDefault: "Send my quote request",
      sendBtnSending: "Sending...",
      sendBtnSent: "✓ Quote request sent",
      sendBtnRetry: "Retry sending",
      statusNotConfigured: "Automatic sending isn't set up on this site yet. Please use the link below for now.",
      statusSendFailed: "Automatic sending didn't work. You can try again, or use the link below.",
      successDefaultTitle: "Quote request sent!",
      successOkWithEmail: function(quoteId, email){ return "Your quote request #" + quoteId + " was sent to you at " + email + "."; },
      successOkWithPhone: function(quoteId, phone){ return "Your quote request #" + quoteId + " has been received. We'll contact you at " + phone + "."; },
      quickAlertMissing: "Please provide your name, a way to reach you, and your message.",
      quickSuccessTitle: "Message sent!",
      quickSuccessMsg: function(msgId){ return "Your message #" + msgId + " has been sent. We'll get back to you soon."; },
      labelQuoteNumber: "Quote request #:",
      labelPhone: "Phone:",
      labelServicesInterested: "Services you're interested in:",
      labelPrecisions: "Details shared:",
      noneSpecified: "Not specified — happy to discuss together.",
      labelAddress: "Address:",
      labelCity: "City:",
      labelResidenceType: "Home type:",
      bedroomsSuffix: "bdrm",
      bathroomsSuffix: "bath",
      labelFrequency: "Preferred frequency:",
      labelStartDate: "Preferred start date:",
      labelAdditionalNotes: "Additional notes:",
      otherPrefix: "Other (",
      customFreqPrefix: "Custom (",
      zoneCheckerFound: function(cityLabel, zoneTitle, zonePrice){ return cityLabel + ' is in <b>' + zoneTitle + '</b> — ' + zonePrice + '.'; },
      zoneCheckerNotFound: 'Area not recognized — leave us your details in the <a href="#simulateur" style="color:var(--ink);border-bottom:1px solid var(--gold);text-decoration:none;">quote request form</a> and we’ll confirm your zone.',
      countryFrequent: 'Frequent',
      countryAll: 'All countries'
    },
    es: {
      stepLabels: ["Sus datos de contacto", "Sus necesidades", "Su residencia", "El ritmo que le conviene", "Últimos detalles"],
      stepProgress: function(n, total, label){ return "Paso " + n + " de " + total + ": " + label; },
      errPhoneInvalid: "El número de teléfono ingresado parece inválido.",
      errEmailInvalid: "La dirección de correo ingresada parece inválida.",
      errNameContact: "Indique su nombre y una forma de contactarlo (teléfono o correo electrónico).",
      errConsent: "Marque la casilla de autorización para enviar su solicitud.",
      emailSuggest: function(s){ return "¿Quiso decir " + s + "?"; },
      loadingPrep: "Preparando su solicitud de cotización...",
      loadingSend: "Enviando su solicitud de cotización...",
      loadingMsg: "Enviando su mensaje...",
      sendBtnDefault: "Enviar mi solicitud",
      sendBtnSending: "Enviando...",
      sendBtnSent: "✓ Solicitud enviada",
      sendBtnRetry: "Reintentar envío",
      statusNotConfigured: "El envío automático aún no está configurado en este sitio. Use el enlace de abajo por el momento.",
      statusSendFailed: "El envío automático no funcionó. Puede volver a intentarlo o usar el enlace de abajo.",
      successDefaultTitle: "¡Solicitud enviada!",
      successOkWithEmail: function(quoteId, email){ return "Su solicitud n.º " + quoteId + " le fue enviada a " + email + "."; },
      successOkWithPhone: function(quoteId, phone){ return "Su solicitud n.º " + quoteId + " fue recibida. Nos comunicaremos con usted al " + phone + "."; },
      quickAlertMissing: "Indique su nombre, una forma de contactarlo y su mensaje.",
      quickSuccessTitle: "¡Mensaje enviado!",
      quickSuccessMsg: function(msgId){ return "Su mensaje n.º " + msgId + " fue enviado. Nos pondremos en contacto pronto."; },
      labelQuoteNumber: "N.º de solicitud:",
      labelPhone: "Teléfono:",
      labelServicesInterested: "Servicios de su interés:",
      labelPrecisions: "Detalles indicados:",
      noneSpecified: "Sin especificar — con gusto lo conversamos juntos.",
      labelAddress: "Dirección:",
      labelCity: "Ciudad:",
      labelResidenceType: "Tipo de residencia:",
      bedroomsSuffix: "hab.",
      bathroomsSuffix: "baño(s)",
      labelFrequency: "Frecuencia deseada:",
      labelStartDate: "Fecha de inicio deseada:",
      labelAdditionalNotes: "Precisiones adicionales:",
      otherPrefix: "Otro (",
      customFreqPrefix: "Personalizado (",
      zoneCheckerFound: function(cityLabel, zoneTitle, zonePrice){ return cityLabel + ' se encuentra en <b>' + zoneTitle + '</b> — ' + zonePrice + '.'; },
      zoneCheckerNotFound: 'Sector no reconocido — déjenos sus datos en el <a href="#simulateur" style="color:var(--ink);border-bottom:1px solid var(--gold);text-decoration:none;">formulario de cotización</a> y confirmaremos su zona.',
      countryFrequent: 'Frecuentes',
      countryAll: 'Todos los países'
    }
  };
  var T = STR[LANG];

  /* ---- valeurs canoniques (françaises, telles qu'enregistrées dans les
     attributs value= des champs du formulaire, identiques sur les 3 pages)
     -> libellé affiché dans la langue de la page. Sert uniquement à
     l'affichage (résumé éditable, courriel client) ; les valeurs elles-mêmes
     restent en français partout, ce qui permet au courriel destiné à la
     conciergerie de rester simple et cohérent quelle que soit la langue du
     site visité. ---- */
  var VALUE_LABELS = {
    en: {
      "Entretien résidentiel": "Residential cleaning",
      "Soins spécialisés": "Specialized care",
      "Organisation et optimisation": "Organization & optimization",
      "Soutien et accompagnement": "Support & assistance",
      "Suivi en votre absence": "Away-from-home monitoring",
      "Ponctuel": "One-time",
      "Mensuel": "Monthly",
      "Aux 2 semaines": "Every 2 weeks",
      "Hebdomadaire": "Weekly",
      "Sur mesure": "Custom",
      "Condo / appartement": "Condo / apartment",
      "Maison unifamiliale": "Single-family home",
      "Duplex / Plex": "Duplex / Plex",
      "Grande propriété": "Large property",
      "Autre": "Other",
      "5 et plus": "5 or more",
      "4 et plus": "4 or more"
    },
    es: {
      "Entretien résidentiel": "Limpieza residencial",
      "Soins spécialisés": "Cuidados especializados",
      "Organisation et optimisation": "Organización y optimización",
      "Soutien et accompagnement": "Apoyo y acompañamiento",
      "Suivi en votre absence": "Seguimiento en su ausencia",
      "Ponctuel": "Puntual",
      "Mensuel": "Mensual",
      "Aux 2 semaines": "Cada 2 semanas",
      "Hebdomadaire": "Semanal",
      "Sur mesure": "Personalizado",
      "Condo / appartement": "Condominio / apartamento",
      "Maison unifamiliale": "Casa unifamiliar",
      "Duplex / Plex": "Dúplex / Plex",
      "Grande propriété": "Propiedad grande",
      "Autre": "Otro",
      "5 et plus": "5 o más",
      "4 et plus": "4 o más"
    }
  };
  function localizeValue(raw){
    if(LANG === 'fr' || !raw) return raw;
    return (VALUE_LABELS[LANG] && VALUE_LABELS[LANG][raw]) || raw;
  }

  /* ---- mois, par langue (pour l'horodatage des courriels) ---- */
  var MONTHS = {
    fr: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  };
  /* ---- numéro de référence ----
     Généré côté client (pas de serveur/BD), visible dès l'ouverture du courriel
     par la conciergerie : format KK-SAAMMJJ-NNNN ou KK-MAAMMJJ-NNNN (lettre de
     type + date + 4 chiffres aléatoires), lisible et pratique à noter/retrouver
     dans les échanges avec la cliente. Le "S" marque une vraie soumission
     (assistant en 5 étapes), le "M" un message rapide (formulaire de contact). */
  function pad2(n){ return (n < 10 ? '0' : '') + n; }
  function generateQuoteId(type){
    var d = new Date();
    var datePart = String(d.getFullYear()).slice(-2) + pad2(d.getMonth() + 1) + pad2(d.getDate());
    var randPart = Math.floor(1000 + Math.random() * 9000);
    return 'KK-' + type + datePart + '-' + randPart;
  }
  /* ---- horodatage lisible de la demande, dans la langue de la page ----
     Affiché sur la première ligne du courriel client (et toujours en
     français dans le courriel destiné à la conciergerie, voir plus bas). */
  function formatQuoteTimestamp(lang){
    var d = new Date();
    var months = MONTHS[lang] || MONTHS.fr;
    if(lang === 'en'){
      return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    }
    if(lang === 'es'){
      return d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear() + ', ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    }
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' à ' + pad2(d.getHours()) + ' h ' + pad2(d.getMinutes());
  }
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
  /* ---- indicatifs téléphoniques : tous les pays, avec autocomplétion, triés
     selon la langue de la page (les codes restent identiques, seuls les noms
     de pays affichés changent) ---- */
  var COUNTRY_CODES = {
    fr: [
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
    ],
    en: [
    ["Afghanistan","+93"],["South Africa","+27"],["Albania","+355"],["Algeria","+213"],
    ["Germany","+49"],["Andorra","+376"],["Angola","+244"],["Antigua and Barbuda","+1268"],
    ["Saudi Arabia","+966"],["Argentina","+54"],["Armenia","+374"],["Australia","+61"],
    ["Austria","+43"],["Azerbaijan","+994"],["Bahamas","+1242"],["Bahrain","+973"],
    ["Bangladesh","+880"],["Barbados","+1246"],["Belgium","+32"],["Belize","+501"],
    ["Benin","+229"],["Bhutan","+975"],["Belarus","+375"],["Myanmar (Burma)","+95"],
    ["Bolivia","+591"],["Bosnia and Herzegovina","+387"],["Botswana","+267"],["Brazil","+55"],
    ["Brunei","+673"],["Bulgaria","+359"],["Burkina Faso","+226"],["Burundi","+257"],
    ["Cambodia","+855"],["Cameroon","+237"],["Canada","+1"],["Cape Verde","+238"],
    ["Chile","+56"],["China","+86"],["Cyprus","+357"],["Colombia","+57"],
    ["Comoros","+269"],["Congo-Brazzaville","+242"],["Congo (DRC)","+243"],["North Korea","+850"],
    ["South Korea","+82"],["Costa Rica","+506"],["Ivory Coast","+225"],["Croatia","+385"],
    ["Cuba","+53"],["Denmark","+45"],["Djibouti","+253"],["Dominica","+1767"],
    ["Egypt","+20"],["United Arab Emirates","+971"],["Ecuador","+593"],["Eritrea","+291"],
    ["Spain","+34"],["Estonia","+372"],["Eswatini","+268"],["United States","+1"],
    ["USA","+1"],["Ethiopia","+251"],["Fiji","+679"],["Finland","+358"],
    ["France","+33"],["Gabon","+241"],["Gambia","+220"],["Georgia","+995"],
    ["Ghana","+233"],["Greece","+30"],["Grenada","+1473"],["Guatemala","+502"],
    ["Guinea","+224"],["Guinea-Bissau","+245"],["Equatorial Guinea","+240"],["Guyana","+592"],
    ["Haiti","+509"],["Honduras","+504"],["Hong Kong","+852"],["Hungary","+36"],
    ["Marshall Islands","+692"],["Solomon Islands","+677"],["India","+91"],["Indonesia","+62"],
    ["Iraq","+964"],["Iran","+98"],["Ireland","+353"],["Iceland","+354"],
    ["Israel","+972"],["Italy","+39"],["Jamaica","+1876"],["Japan","+81"],
    ["Jordan","+962"],["Kazakhstan","+7"],["Kenya","+254"],["Kyrgyzstan","+996"],
    ["Kiribati","+686"],["Kuwait","+965"],["Laos","+856"],["Lesotho","+266"],
    ["Latvia","+371"],["Lebanon","+961"],["Liberia","+231"],["Libya","+218"],
    ["Liechtenstein","+423"],["Lithuania","+370"],["Luxembourg","+352"],["Macau","+853"],
    ["North Macedonia","+389"],["Madagascar","+261"],["Malaysia","+60"],["Malawi","+265"],
    ["Maldives","+960"],["Mali","+223"],["Malta","+356"],["Morocco","+212"],
    ["Mauritius","+230"],["Mauritania","+222"],["Mexico","+52"],["Micronesia","+691"],
    ["Moldova","+373"],["Monaco","+377"],["Mongolia","+976"],["Montenegro","+382"],
    ["Mozambique","+258"],["Namibia","+264"],["Nauru","+674"],["Nepal","+977"],
    ["Nicaragua","+505"],["Niger","+227"],["Nigeria","+234"],["Norway","+47"],
    ["New Zealand","+64"],["Oman","+968"],["Uganda","+256"],["Uzbekistan","+998"],
    ["Pakistan","+92"],["Palau","+680"],["Palestine","+970"],["Panama","+507"],
    ["Papua New Guinea","+675"],["Paraguay","+595"],["Netherlands","+31"],["Peru","+51"],
    ["Philippines","+63"],["Poland","+48"],["Portugal","+351"],["Qatar","+974"],
    ["Central African Republic","+236"],["Dominican Republic","+1809"],["Czech Republic","+420"],["Romania","+40"],
    ["United Kingdom","+44"],["Russia","+7"],["Rwanda","+250"],["Saint Kitts and Nevis","+1869"],
    ["San Marino","+378"],["Saint Vincent and the Grenadines","+1784"],["Saint Lucia","+1758"],["El Salvador","+503"],
    ["Samoa","+685"],["São Tomé and Príncipe","+239"],["Senegal","+221"],["Serbia","+381"],
    ["Seychelles","+248"],["Sierra Leone","+232"],["Singapore","+65"],["Slovakia","+421"],
    ["Slovenia","+386"],["Somalia","+252"],["Sudan","+249"],["South Sudan","+211"],
    ["Sri Lanka","+94"],["Sweden","+46"],["Switzerland","+41"],["Suriname","+597"],
    ["Syria","+963"],["Taiwan","+886"],["Tajikistan","+992"],["Tanzania","+255"],
    ["Chad","+235"],["Thailand","+66"],["East Timor","+670"],["Togo","+228"],
    ["Tonga","+676"],["Trinidad and Tobago","+1868"],["Tunisia","+216"],["Turkmenistan","+993"],
    ["Turkey","+90"],["Tuvalu","+688"],["Ukraine","+380"],["Uruguay","+598"],
    ["Vanuatu","+678"],["Vatican City","+379"],["Venezuela","+58"],["Vietnam","+84"],
    ["Yemen","+967"],["Zambia","+260"],["Zimbabwe","+263"]
    ],
    es: [
    ["Afganistán","+93"],["Sudáfrica","+27"],["Albania","+355"],["Argelia","+213"],
    ["Alemania","+49"],["Andorra","+376"],["Angola","+244"],["Antigua y Barbuda","+1268"],
    ["Arabia Saudita","+966"],["Argentina","+54"],["Armenia","+374"],["Australia","+61"],
    ["Austria","+43"],["Azerbaiyán","+994"],["Bahamas","+1242"],["Baréin","+973"],
    ["Bangladés","+880"],["Barbados","+1246"],["Bélgica","+32"],["Belice","+501"],
    ["Benín","+229"],["Bután","+975"],["Bielorrusia","+375"],["Birmania (Myanmar)","+95"],
    ["Bolivia","+591"],["Bosnia y Herzegovina","+387"],["Botsuana","+267"],["Brasil","+55"],
    ["Brunéi","+673"],["Bulgaria","+359"],["Burkina Faso","+226"],["Burundi","+257"],
    ["Camboya","+855"],["Camerún","+237"],["Canadá","+1"],["Cabo Verde","+238"],
    ["Chile","+56"],["China","+86"],["Chipre","+357"],["Colombia","+57"],
    ["Comoras","+269"],["Congo-Brazzaville","+242"],["Congo (RDC)","+243"],["Corea del Norte","+850"],
    ["Corea del Sur","+82"],["Costa Rica","+506"],["Costa de Marfil","+225"],["Croacia","+385"],
    ["Cuba","+53"],["Dinamarca","+45"],["Yibuti","+253"],["Dominica","+1767"],
    ["Egipto","+20"],["Emiratos Árabes Unidos","+971"],["Ecuador","+593"],["Eritrea","+291"],
    ["España","+34"],["Estonia","+372"],["Esuatini","+268"],["Estados Unidos","+1"],
    ["EE. UU.","+1"],["Etiopía","+251"],["Fiyi","+679"],["Finlandia","+358"],
    ["Francia","+33"],["Gabón","+241"],["Gambia","+220"],["Georgia","+995"],
    ["Ghana","+233"],["Grecia","+30"],["Granada","+1473"],["Guatemala","+502"],
    ["Guinea","+224"],["Guinea-Bisáu","+245"],["Guinea Ecuatorial","+240"],["Guyana","+592"],
    ["Haití","+509"],["Honduras","+504"],["Hong Kong","+852"],["Hungría","+36"],
    ["Islas Marshall","+692"],["Islas Salomón","+677"],["India","+91"],["Indonesia","+62"],
    ["Irak","+964"],["Irán","+98"],["Irlanda","+353"],["Islandia","+354"],
    ["Israel","+972"],["Italia","+39"],["Jamaica","+1876"],["Japón","+81"],
    ["Jordania","+962"],["Kazajistán","+7"],["Kenia","+254"],["Kirguistán","+996"],
    ["Kiribati","+686"],["Kuwait","+965"],["Laos","+856"],["Lesoto","+266"],
    ["Letonia","+371"],["Líbano","+961"],["Liberia","+231"],["Libia","+218"],
    ["Liechtenstein","+423"],["Lituania","+370"],["Luxemburgo","+352"],["Macao","+853"],
    ["Macedonia del Norte","+389"],["Madagascar","+261"],["Malasia","+60"],["Malaui","+265"],
    ["Maldivas","+960"],["Malí","+223"],["Malta","+356"],["Marruecos","+212"],
    ["Mauricio","+230"],["Mauritania","+222"],["México","+52"],["Micronesia","+691"],
    ["Moldavia","+373"],["Mónaco","+377"],["Mongolia","+976"],["Montenegro","+382"],
    ["Mozambique","+258"],["Namibia","+264"],["Nauru","+674"],["Nepal","+977"],
    ["Nicaragua","+505"],["Níger","+227"],["Nigeria","+234"],["Noruega","+47"],
    ["Nueva Zelanda","+64"],["Omán","+968"],["Uganda","+256"],["Uzbekistán","+998"],
    ["Pakistán","+92"],["Palaos","+680"],["Palestina","+970"],["Panamá","+507"],
    ["Papúa Nueva Guinea","+675"],["Paraguay","+595"],["Países Bajos","+31"],["Perú","+51"],
    ["Filipinas","+63"],["Polonia","+48"],["Portugal","+351"],["Catar","+974"],
    ["República Centroafricana","+236"],["República Dominicana","+1809"],["República Checa","+420"],["Rumania","+40"],
    ["Reino Unido","+44"],["Rusia","+7"],["Ruanda","+250"],["San Cristóbal y Nieves","+1869"],
    ["San Marino","+378"],["San Vicente y las Granadinas","+1784"],["Santa Lucía","+1758"],["El Salvador","+503"],
    ["Samoa","+685"],["Santo Tomé y Príncipe","+239"],["Senegal","+221"],["Serbia","+381"],
    ["Seychelles","+248"],["Sierra Leona","+232"],["Singapur","+65"],["Eslovaquia","+421"],
    ["Eslovenia","+386"],["Somalia","+252"],["Sudán","+249"],["Sudán del Sur","+211"],
    ["Sri Lanka","+94"],["Suecia","+46"],["Suiza","+41"],["Surinam","+597"],
    ["Siria","+963"],["Taiwán","+886"],["Tayikistán","+992"],["Tanzania","+255"],
    ["Chad","+235"],["Tailandia","+66"],["Timor Oriental","+670"],["Togo","+228"],
    ["Tonga","+676"],["Trinidad y Tobago","+1868"],["Túnez","+216"],["Turkmenistán","+993"],
    ["Turquía","+90"],["Tuvalu","+688"],["Ucrania","+380"],["Uruguay","+598"],
    ["Vanuatu","+678"],["Ciudad del Vaticano","+379"],["Venezuela","+58"],["Vietnam","+84"],
    ["Yemen","+967"],["Zambia","+260"],["Zimbabue","+263"]
    ]
  };
  COUNTRY_CODES[LANG].sort(function(a,b){ return a[0].localeCompare(b[0], LOCALE_TAG[LANG]); });

  var indicatifSelectEl = document.getElementById('indicatif');
  if(indicatifSelectEl){
    var ogFreq = document.createElement('optgroup');
    ogFreq.label = T.countryFrequent;
    [["Canada","+1"],["USA_OR_ETATSUNIS","+1"]].forEach(function(c){
      var label = c[0] === 'Canada' ? (LANG === 'en' ? 'Canada' : LANG === 'es' ? 'Canadá' : 'Canada') : (LANG === 'en' ? 'United States' : LANG === 'es' ? 'Estados Unidos' : 'États-Unis');
      var opt = document.createElement('option');
      opt.value = c[1];
      opt.textContent = label + ' (' + c[1] + ')';
      if(c[0] === 'Canada') opt.selected = true;
      ogFreq.appendChild(opt);
    });
    indicatifSelectEl.appendChild(ogFreq);
    var ogAll = document.createElement('optgroup');
    ogAll.label = T.countryAll;
    COUNTRY_CODES[LANG].forEach(function(c){
      var opt = document.createElement('option');
      opt.value = c[1];
      opt.textContent = c[0] + ' (' + c[1] + ')';
      ogAll.appendChild(opt);
    });
    indicatifSelectEl.appendChild(ogAll);
  }
  /* ---- zones data (secteurs desservis, du centre vers la périphérie) ----
     Les noms de villes ne sont jamais traduits (ce sont des noms propres,
     identiques sur les 3 versions du site) ; seuls le titre, le prix et la
     note de chaque zone changent selon la langue. */
  var ZONES = {
    fr: [
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
    ],
    en: [
      {
        id: '1', title: 'Zone 1 · Central sector', price: 'No surcharge',
        note: "Zone 1: no travel fee. Minimum billing: 1 hour.",
        cities: ['Sainte-Foy', 'Sillery', 'Cap-Rouge', 'Québec (centre-ville)', "L'Ancienne-Lorette", 'Loretteville']
      },
      {
        id: '2', title: 'Zone 2 · Greater Québec City area', price: 'Small surcharge',
        note: "Zone 2: a small travel surcharge applies. Minimum billing: 1 hour.",
        cities: ['Charlesbourg', 'Beauport', 'Val-Bélair', 'Saint-Augustin-de-Desmaures', 'Lévis (secteurs proches)']
      },
      {
        id: '3', title: 'Zone 3 · Extended outskirts', price: 'Surcharge based on distance',
        note: "Zone 3: a travel surcharge applies based on distance. Minimum billing: 1 hour.",
        cities: ['Lévis (secteurs éloignés)', 'Donnacona', 'Pont-Rouge', 'Shannon', 'Neuville']
      },
      {
        id: '4', title: 'Exceptional travel', price: 'Quote on request',
        note: "Exceptional travel: fee calculated based on distance and agreed with you. Minimum billing: 1 hour.",
        cities: ['Portneuf', 'Charlevoix', 'Côte-de-Beaupré']
      }
    ],
    es: [
      {
        id: '1', title: 'Zona 1 · Sector central', price: 'Sin recargo',
        note: "Zona 1: sin cargo por desplazamiento. Facturación mínima: 1 hora.",
        cities: ['Sainte-Foy', 'Sillery', 'Cap-Rouge', 'Québec (centre-ville)', "L'Ancienne-Lorette", 'Loretteville']
      },
      {
        id: '2', title: 'Zona 2 · Área metropolitana de Quebec', price: 'Recargo leve',
        note: "Zona 2: se aplica un pequeño recargo por desplazamiento. Facturación mínima: 1 hora.",
        cities: ['Charlesbourg', 'Beauport', 'Val-Bélair', 'Saint-Augustin-de-Desmaures', 'Lévis (secteurs proches)']
      },
      {
        id: '3', title: 'Zona 3 · Periferia extendida', price: 'Recargo según la distancia',
        note: "Zona 3: se aplica un recargo por desplazamiento según la distancia. Facturación mínima: 1 hora.",
        cities: ['Lévis (secteurs éloignés)', 'Donnacona', 'Pont-Rouge', 'Shannon', 'Neuville']
      },
      {
        id: '4', title: 'Desplazamiento excepcional', price: 'Bajo cotización',
        note: "Desplazamiento excepcional: costo calculado según la distancia y acordado con usted. Facturación mínima: 1 hora.",
        cities: ['Portneuf', 'Charlevoix', 'Côte-de-Beaupré']
      }
    ]
  };
  var ZONE_NOTES = {};
  ZONES[LANG].forEach(function(z){ ZONE_NOTES[z.id] = z.note; });
  var ZONE_NOTES_FR = {};
  ZONES.fr.forEach(function(z){ ZONE_NOTES_FR[z.id] = z.note; });

  /* ---- ville -> zone (déduit silencieusement pour le formulaire, et pour le vérificateur) ---- */
  function kkNormalizeCity(s){
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/^st(e)?[\s-]/,'saint$1 ').trim();
  }
  var kkCityMap = [];
  ZONES[LANG].forEach(function(z){
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

  /* ---- type de résidence : révèle un champ libre pour "Autre" ---- */
  var typeResidenceSelect = document.getElementById('typeResidence');
  var typeResidenceAutreField = document.getElementById('typeResidenceAutreField');
  var typeResidenceAutreTexte = document.getElementById('typeResidenceAutreTexte');
  if(typeResidenceSelect){
    typeResidenceSelect.addEventListener('change', function(){
      if(typeResidenceAutreField) typeResidenceAutreField.hidden = (typeResidenceSelect.value !== 'Autre');
    });
  }
  /* ---- wizard ---- */
  var STEP_LABELS = T.stepLabels;
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
    wpLabel.textContent = T.stepProgress(n, totalSteps, STEP_LABELS[n-1]);
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
  /* ---- suggestion de correction sur les domaines de courriel courants ----
     N'empêche jamais l'envoi — avertit seulement des fautes de frappe fréquentes
     (gnail.com, gmial.com, hotmial.com...) avant qu'elles ne causent un rebond
     comme "adresse introuvable" une fois le courriel parti. */
  var COMMON_EMAIL_DOMAINS = [
    'gmail.com','hotmail.com','outlook.com','yahoo.com','icloud.com',
    'live.com','msn.com','aol.com','videotron.ca','bell.net','sympatico.ca'
  ];
  function levenshtein(a, b){
    var m = a.length, n = b.length;
    var d = [];
    for(var i = 0; i <= m; i++) d[i] = [i];
    for(var j = 0; j <= n; j++) d[0][j] = j;
    for(i = 1; i <= m; i++){
      for(j = 1; j <= n; j++){
        d[i][j] = a.charAt(i-1) === b.charAt(j-1)
          ? d[i-1][j-1]
          : 1 + Math.min(d[i-1][j-1], d[i-1][j], d[i][j-1]);
      }
    }
    return d[m][n];
  }
  function suggestEmailDomain(email){
    var at = email.lastIndexOf('@');
    if(at < 1 || at === email.length - 1) return null;
    var local = email.slice(0, at);
    var domain = email.slice(at + 1).toLowerCase();
    if(COMMON_EMAIL_DOMAINS.indexOf(domain) !== -1) return null;
    var best = null, bestDist = 3;
    COMMON_EMAIL_DOMAINS.forEach(function(known){
      var dist = levenshtein(domain, known);
      /* on ignore les domaines trop courts pour éviter les faux positifs
         (une distance de 1-2 sur "aol.com" changerait presque n'importe quoi) */
      if(dist > 0 && dist < bestDist && known.length >= 5){
        best = known; bestDist = dist;
      }
    });
    return best ? local + '@' + best : null;
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
  var courrielSuggestEl = document.getElementById('courrielSuggest');
  function updateCourrielSuggestion(){
    if(!courrielSuggestEl) return;
    var v = courrielInput.value.trim();
    var suggestion = (v && isValidEmail(v)) ? suggestEmailDomain(v) : null;
    if(suggestion){
      courrielSuggestEl.textContent = T.emailSuggest(suggestion);
      courrielSuggestEl.dataset.suggestion = suggestion;
      courrielSuggestEl.hidden = false;
    } else {
      courrielSuggestEl.hidden = true;
    }
  }
  if(courrielInput) courrielInput.addEventListener('blur', function(){
    var v = this.value.trim();
    setFieldError('courrielField', !!v && !isValidEmail(v));
    updateCourrielSuggestion();
  });
  if(courrielSuggestEl){
    courrielSuggestEl.addEventListener('click', function(){
      if(this.dataset.suggestion){
        courrielInput.value = this.dataset.suggestion;
        this.hidden = true;
        setFieldError('courrielField', false);
      }
    });
  }
  wizNext.addEventListener('click', function(){
    if(currentStep === 1){
      var v1 = validateCoordonnees();
      if(!v1.ok){
        formError.textContent = !v1.telOk
          ? T.errPhoneInvalid
          : !v1.courrielOk
          ? T.errEmailInvalid
          : T.errNameContact;
        formError.style.display = 'block';
        return;
      }
    }
    if(currentStep < totalSteps){ currentStep++; showStep(currentStep); kkTrack('soumission_etape_' + currentStep); }
  });
  wizBack.addEventListener('click', function(){
    if(currentStep > 1){ currentStep--; showStep(currentStep); }
  });
  showStep(currentStep);

  /* ---- form submit ---- */
  var form = document.getElementById('quoteForm');
  var resumePanel = document.getElementById('resumePanel');
  var resumeBody = document.getElementById('resumeBody');
  var loadingOverlay = document.getElementById('loadingOverlay');
  var loadingOverlayText = loadingOverlay ? loadingOverlay.querySelector('p') : null;
  function showLoadingOverlay(text){
    if(!loadingOverlay) return;
    if(loadingOverlayText) loadingOverlayText.textContent = text;
    loadingOverlay.hidden = false;
  }
  function hideLoadingOverlay(){
    if(loadingOverlay) loadingOverlay.hidden = true;
  }

  /* ---- construction du "coeur" du résumé ----
     buildCore(lang) construit le même résumé structuré, mais dans la langue
     demandée : STR[lang] pour les libellés, localizeValue()/VALUE_LABELS
     pour les valeurs cochées (les attributs value= des champs restent
     toujours en français, identiques sur les 3 pages — voir index.html).
     - buildCore(LANG) : affiché à l'écran (résumé éditable) et utilisé tel
       quel pour le courriel de confirmation envoyé à la cliente.
     - buildCore('fr') : recalculé indépendamment à l'instant de l'envoi et
       utilisé uniquement pour le courriel interne à la conciergerie, qui
       reste toujours en français quelle que soit la langue du site visité. */
  function buildCore(lang){
    var STRl = STR[lang];
    var localize = function(v){ return lang === 'fr' ? v : localizeValue(v); };

    var nom = document.getElementById('nom').value.trim();
    var tel = document.getElementById('tel').value.trim();
    var indicatif = document.getElementById('indicatif').value;
    var adresse = document.getElementById('adresse').value.trim();
    var appartement = document.getElementById('appartement').value.trim();
    var ville = document.getElementById('ville').value.trim();
    var codePostal = document.getElementById('codePostal').value.trim();
    var typeResidence = document.getElementById('typeResidence').value;
    var typeResidenceTxt = typeResidence === 'Autre' && typeResidenceAutreTexte && typeResidenceAutreTexte.value.trim()
      ? STRl.otherPrefix + typeResidenceAutreTexte.value.trim() + ")"
      : localize(typeResidence);
    var chambres = document.getElementById('chambres').value;
    var sdb = document.getElementById('sdb').value;
    var attentes = document.getElementById('attentes').value.trim();
    var frequenceEl = form.querySelector('input[name="frequence"]:checked');
    var frequenceTxt = frequenceEl.value === 'Sur mesure' && freqAutreTexte.value.trim()
      ? STRl.customFreqPrefix + freqAutreTexte.value.trim() + ")"
      : localize(frequenceEl.value);
    var interets = Array.prototype.slice.call(form.querySelectorAll('input[name="interet"]:checked')).map(function(el){ return localize(el.value); });
    var dateDebut = document.getElementById('dateDebut').value;
    var notes = document.getElementById('notes').value.trim();
    var quoteId = lastQuoteId;

    var lines = [];
    lines.push(STRl.labelQuoteNumber + " " + quoteId);
    if(tel){
      lines.push("");
      lines.push(STRl.labelPhone + " " + (indicatif ? indicatif + " " : "") + tel);
    }
    lines.push("");
    if(interets.length) lines.push(STRl.labelServicesInterested + " " + interets.join(", "));
    lines.push(STRl.labelPrecisions + " " + (attentes || STRl.noneSpecified));
    lines.push("");
    if(adresse) lines.push(STRl.labelAddress + " " + adresse + (appartement ? ", " + appartement : ""));
    if(ville) lines.push(STRl.labelCity + " " + ville + (codePostal ? " (" + codePostal + ")" : ""));
    lines.push(STRl.labelResidenceType + " " + typeResidenceTxt + " · " + chambres + " " + STRl.bedroomsSuffix + " · " + sdb + " " + STRl.bathroomsSuffix);
    lines.push("");
    lines.push(STRl.labelFrequency + " " + frequenceTxt);
    if(dateDebut) lines.push(STRl.labelStartDate + " " + dateDebut);
    if(notes) lines.push(STRl.labelAdditionalNotes + " " + notes);
    return lines.join("\n");
  }

  var lastQuoteId = null;

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var nom = document.getElementById('nom').value.trim();
    var tel = document.getElementById('tel').value.trim();
    var indicatif = document.getElementById('indicatif').value;
    var courriel = document.getElementById('courriel').value.trim();
    var ville = document.getElementById('ville').value.trim();
    var consent = document.getElementById('consent').checked;

    if(!nom || (!tel && !courriel)){
      currentStep = 1; showStep(1);
      formError.textContent = T.errNameContact;
      formError.style.display = 'block';
      return;
    }
    if(!consent){
      formError.textContent = T.errConsent;
      formError.style.display = 'block';
      return;
    }
    formError.style.display = 'none';

    var zoneNum = kkZoneForCity(ville) || 1;
    var zoneTxtFR = ZONE_NOTES_FR[zoneNum];
    lastQuoteId = generateQuoteId('S');
    var timestampTxtFR = formatQuoteTimestamp('fr');

    /* ---- "coeur" du résumé : la seule partie éditable, et la seule que les deux
       courriels ont en commun côté client. Ni le nom, ni le courriel, ni la ligne
       de zone/tarification, ni la phrase de consentement n'y figurent — ces
       éléments sont du ressort de la conciergerie et sont ajoutés séparément
       (voir plus bas, buildBusinessBody) autour du texte que la cliente a sous
       les yeux. Le courriel interne (conciergerie) reste toujours en français :
       il est reconstruit indépendamment à partir des mêmes champs (coreBodyFR),
       et non recopié depuis ce résumé, qui lui s'affiche dans la langue de la
       page et peut être corrigé par la cliente avant l'envoi. */
    var coreBody = buildCore(LANG);
    var coreBodyFR = buildCore('fr');

    var mailSubject = "Demande de soumission #" + lastQuoteId + " — " + nom;

    /* on mémorise ce qu'il faut pour l'envoi réel, déclenché plus tard par le
       bouton "Envoyer ma soumission" — la cliente peut d'abord
       relire et corriger le résumé affiché. */
    lastSubmission = { nom: nom, tel: tel, indicatif: indicatif, courriel: courriel, subject: mailSubject, quoteId: lastQuoteId, zoneTxtFR: zoneTxtFR, timestampTxtFR: timestampTxtFR, coreBodyFR: coreBodyFR };

    wizSubmit.disabled = true;
    showLoadingOverlay(T.loadingPrep);

    /* petit temps de "préparation" (étincelles) avant de révéler le résumé éditable */
    window.setTimeout(function(){
      resumeBody.textContent = coreBody;
      resetSendState();

      hideLoadingOverlay();

      /* "Recevoir ma soumission" a fait son travail : on le masque pour ne
         pas laisser un bouton qui ne fait plus rien de nouveau. "Précédent"
         reste visible pour permettre de retourner corriger une étape. */
      wizSubmit.hidden = true;

      resumePanel.style.display = 'block';
      resumePanel.classList.remove('reveal');
      /* force le redémarrage de l'animation même si "reveal" était déjà passé une fois */
      void resumePanel.offsetWidth;
      resumePanel.classList.add('reveal');

      resumePanel.scrollIntoView({behavior:'smooth', block:'start'});
    }, 950);
  });
  /* ---- envoi réel de la soumission (bouton dédié, déclenché manuellement) ----
     Le texte envoyé au client est celui affiché dans #resumeBody au moment du
     clic, donc toute correction faite par la cliente avant l'envoi est bien
     prise en compte. Le texte envoyé à la conciergerie utilise plutôt
     lastSubmission.coreBodyFR (toujours en français, calculé à l'étape
     précédente), pour rester indépendant de la langue de la page et des
     corrections apportées par la cliente à son propre résumé. */
  var sendQuoteBtn = document.getElementById('sendQuoteBtn');
  var sendStatus = document.getElementById('sendStatus');
  var mailFallbackLink = document.getElementById('mailFallbackLink');
  var lastSubmission = null;
  var quoteSent = false;

  /* ---- pop-up de confirmation (fusée) ---- */
  var successBackdrop = document.getElementById('successBackdrop');
  var successModal = document.getElementById('successModal');
  var successModalClose = document.getElementById('successModalClose');
  var successModalText = document.getElementById('successModalText');
  var successModalTitle = document.getElementById('successModalTitle');
  var successModalIcon = document.getElementById('successModalIcon');

  function openSuccessModal(message, title, icon){
    successModalTitle.textContent = title || T.successDefaultTitle;
    successModalIcon.textContent = icon || '🚀';
    successModalText.textContent = message;
    successBackdrop.hidden = false;
    successModal.hidden = false;
    document.body.classList.add('modal-open');
  }
  function closeSuccessModal(){
    successBackdrop.hidden = true;
    successModal.hidden = true;
    document.body.classList.remove('modal-open');
  }
  successModalClose.addEventListener('click', closeSuccessModal);
  successBackdrop.addEventListener('click', closeSuccessModal);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !successModal.hidden) closeSuccessModal();
  });

  function resetSendState(){
    quoteSent = false;
    sendQuoteBtn.disabled = false;
    sendQuoteBtn.textContent = T.sendBtnDefault;
    sendStatus.className = 'send-status';
    sendStatus.innerHTML = '';
    mailFallbackLink.hidden = true;
    closeSuccessModal();
  }

  /* si la cliente modifie le résumé après un envoi réussi, on réautorise l'envoi
     (pour qu'elle puisse renvoyer la version corrigée) */
  resumeBody.addEventListener('input', function(){
    if(quoteSent) resetSendState();
  });

  sendQuoteBtn.addEventListener('click', function(){
    if(!lastSubmission || sendQuoteBtn.disabled) return;

    /* le "coeur" du résumé, tel que la cliente le voit et l'a corrigé au besoin,
       dans la langue de la page : c'est ce texte, et lui seul, qui part dans le
       courriel de confirmation envoyé à la cliente. */
    var coreClient = resumeBody.innerText.trim();
    var courriel = lastSubmission.courriel;
    var tel = lastSubmission.tel;
    var indicatif = lastSubmission.indicatif;
    var subject = lastSubmission.subject;

    function buildBusinessBody(){
      var parts = ["Kozy & Klean : nouvelle demande de soumission — " + lastSubmission.timestampTxtFR, ""];
      parts.push("Nom : " + lastSubmission.nom);
      if(courriel) parts.push("Courriel : " + courriel);
      parts.push("");
      parts.push(lastSubmission.coreBodyFR);
      parts.push("");
      parts.push(lastSubmission.zoneTxtFR);
      parts.push("");
      parts.push("La cliente autorise Kozy & Klean à la contacter pour finaliser la soumission et le contrat de service.");
      return parts.join("\n");
    }
    function buildClientBody(){
      return coreClient;
    }

    function offerMailFallback(){
      mailFallbackLink.hidden = false;
      mailFallbackLink.setAttribute('href',
        "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildBusinessBody()));
    }

    sendQuoteBtn.disabled = true;
    sendQuoteBtn.textContent = T.sendBtnSending;
    sendStatus.className = 'send-status';
    sendStatus.innerHTML = '';
    mailFallbackLink.hidden = true;

    if(!emailjsReady){
      /* EmailJS pas encore configuré (voir EMAILJS_README.md) : on retombe sur le mailto */
      offerMailFallback();
      sendStatus.className = 'send-status is-error';
      sendStatus.innerHTML = T.statusNotConfigured;
      sendQuoteBtn.disabled = false;
      sendQuoteBtn.textContent = T.sendBtnDefault;
      return;
    }

    showLoadingOverlay(T.loadingSend);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTIF, {
      subject: subject,
      quote_id: lastSubmission.quoteId,
      client_name: lastSubmission.nom,
      message: buildBusinessBody()
    }).then(function(){
      if(courriel){
        return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_AUTOREPLY, {
          email: courriel,
          to_name: lastSubmission.nom,
          client_name: lastSubmission.nom,
          quote_id: lastSubmission.quoteId,
          message: buildClientBody()
        });
      }
    }).then(function(){
      hideLoadingOverlay();
      quoteSent = true;
      sendQuoteBtn.textContent = T.sendBtnSent;
      var okMsg = courriel
        ? T.successOkWithEmail(lastSubmission.quoteId, courriel)
        : T.successOkWithPhone(lastSubmission.quoteId, (indicatif ? indicatif + " " : "") + tel);
      openSuccessModal(okMsg);
      kkTrack('soumission_envoyee');
    }).catch(function(){
      hideLoadingOverlay();
      sendQuoteBtn.disabled = false;
      sendQuoteBtn.textContent = T.sendBtnRetry;
      sendStatus.className = 'send-status is-error';
      sendStatus.innerHTML = T.statusSendFailed;
      offerMailFallback();
    });
  });

  /* ---- quick message box ----
     Ce message n'a pas de courriel de confirmation dédié pour la cliente (juste
     la pop-up de succès, à l'écran, traduite) : le contenu envoyé à la
     conciergerie reste donc toujours en français, comme le reste des courriels
     internes. */
  document.getElementById('qSend').addEventListener('click', function(){
    var nom = document.getElementById('qNom').value.trim();
    var contact = document.getElementById('qTel').value.trim();
    var msg = document.getElementById('qMsg').value.trim();
    if(!nom || !contact || !msg){
      alert(T.quickAlertMissing);
      return;
    }
    var msgId = generateQuoteId('M');
    var body = "Kozy & Klean : nouveau message rapide — " + formatQuoteTimestamp('fr') + "\n\nN° de référence : " + msgId + "\n\nNom : " + nom + "\nCoordonnées : " + contact + "\n\nMessage :\n" + msg;
    var subject = "Message rapide #" + msgId + " — " + nom;
    var qBtn = document.getElementById('qSend');

    if(!emailjsReady){
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      return;
    }

    qBtn.disabled = true;
    showLoadingOverlay(T.loadingMsg);
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTIF, { subject: subject, quote_id: msgId, client_name: nom, message: body })
      .then(function(){
        hideLoadingOverlay();
        qBtn.disabled = false;
        openSuccessModal(
          T.quickSuccessMsg(msgId),
          T.quickSuccessTitle,
          "🚀"
        );
        kkTrack('message_rapide_envoye');
        document.getElementById('qNom').value = '';
        document.getElementById('qTel').value = '';
        document.getElementById('qMsg').value = '';
      })
      .catch(function(){
        hideLoadingOverlay();
        qBtn.disabled = false;
        window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      });
  });
  /* ---- "Ce que l'on fait" : onglets + carrousel des catégories de services ---- */
  (function(){
    var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>';

    var CATS = {
      fr: [
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
          bullets:['Vérifications et entretien du domicile','Résidence secondaire ou saisonnière','Comptes rendus avec photos, à distance']
        }
      ],
      en: [
        {
          title:'Residential cleaning',
          tag:"Cleaning, done properly",
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="13" width="9" height="7" rx="2"/><circle cx="5.5" cy="20.5" r="1"/><circle cx="9.5" cy="20.5" r="1"/><path d="M12 15c5 0 7-3 7-8"/><path d="M19 7l2.2-1.3"/></svg>',
          bullets:['Full cleaning: kitchen, living areas and bathroom','Laundry, ironing and bed linens','Everyday windows and surfaces']
        },
        {
          title:'Specialized care',
          tag:"Everything regular cleaning doesn't cover",
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/></svg>',
          bullets:['Deep cleaning, appliances','Steam cleaning for carpets and bedding','Seasonal or event deep-clean']
        },
        {
          title:'Organization &amp; optimization',
          tag:'Your space rethought to simplify your life',
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
          desc:"A fresh eye on your living spaces, to make them more functional."
        },
        {
          title:'Support &amp; assistance',
          tag:'Delegate what eats up your time',
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2.2 0 3.5 1.3 4 2 .5-.7 1.8-2 4-2 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>',
          bullets:['Custom task coordination','Errands, shopping, deliveries','At-home family support']
        },
        {
          title:'Away-from-home monitoring',
          tag:"Your home watched over, even from a distance",
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>',
          bullets:['Home checks and upkeep','Secondary or seasonal residence','Remote reports with photos']
        }
      ],
      es: [
        {
          title:'Limpieza residencial',
          tag:"La limpieza, hecha en serio",
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="13" width="9" height="7" rx="2"/><circle cx="5.5" cy="20.5" r="1"/><circle cx="9.5" cy="20.5" r="1"/><path d="M12 15c5 0 7-3 7-8"/><path d="M19 7l2.2-1.3"/></svg>',
          bullets:['Limpieza completa: cocina, sala y baño','Lavado, planchado y ropa de cama','Ventanas y superficies del día a día']
        },
        {
          title:'Cuidados especializados',
          tag:"Todo lo que la limpieza regular no cubre",
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/></svg>',
          bullets:['Limpieza a fondo, electrodomésticos','Limpieza a vapor de alfombras y ropa de cama','Gran limpieza estacional o para eventos']
        },
        {
          title:'Organización y optimización',
          tag:'Sus espacios repensados para simplificarle la vida',
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
          desc:"Una mirada fresca a sus espacios de vida, para hacerlos más funcionales."
        },
        {
          title:'Apoyo y acompañamiento',
          tag:'Delegue lo que le consume el tiempo',
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2.2 0 3.5 1.3 4 2 .5-.7 1.8-2 4-2 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>',
          bullets:['Coordinación de tareas a medida','Mandados, compras, entregas','Apoyo familiar a domicilio']
        },
        {
          title:'Seguimiento en su ausencia',
          tag:"Su residencia vigilada, incluso a distancia",
          icon:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>',
          bullets:['Verificaciones y mantenimiento del hogar','Residencia secundaria o de temporada','Informes con fotos, a distancia']
        }
      ]
    };
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

    CATS[LANG].forEach(function(cat, i){
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
      current = (i + CATS[LANG].length) % CATS[LANG].length;
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
        checkResult.innerHTML = T.zoneCheckerFound(found.label, found.zone.title, found.zone.price);
        checkResult.classList.add('is-found');
      } else {
        checkResult.innerHTML = T.zoneCheckerNotFound;
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
