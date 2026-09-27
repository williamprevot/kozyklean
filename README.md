# 🏡 Kozy & Klean — Site Web

Ce projet est le site vitrine de **Kozy & Klean Conciergerie Nomade**, une entreprise de conciergerie et d'entretien résidentiel basée à Sainte-Foy, Québec. Le site présente les services, les formules tarifaires, la zone desservie et un simulateur de soumission interactif en plusieurs étapes, permettant à un visiteur d'obtenir une estimation personnalisée directement en ligne.

## 📦 Technologies utilisées

* **HTML5 / CSS3** – Structure et mise en page, sans framework ni dépendance externe
* **JavaScript (vanilla)** – Logique du site : navigation, simulateur de soumission, validations de formulaire, effets d'interface
* **Google Fonts** (Fraunces, Work Sans) – Typographies, chargées via CDN
* **Schema.org (JSON-LD)** – Données structurées `LocalBusiness` pour le référencement local
* **Netlify / GitHub Pages** – Hébergement statique et déploiement continu
* **Git / GitHub** – Gestion de version et intégration avec l'hébergeur

## 🧠 Fonctionnement

1. **Présentation** – Sections statiques présentant l'entreprise, les services, l'approche en quatre étapes et les formules tarifaires.
2. **Zone desservie** – Une carte animée et une légende par secteur informent le visiteur des frais de déplacement applicables selon sa localisation.
3. **Simulateur de soumission** – Un formulaire en cinq étapes (`#quoteForm` dans `index.html`) guide le visiteur : coordonnées, résidence, attentes et besoins ponctuels, fréquence souhaitée, derniers détails et confirmation.
4. **Validation en temps réel** – Le courriel et le numéro de téléphone saisis (avec indicatif international) sont vérifiés selon un format valide (`isValidEmail`, `isValidPhone` dans `assets/script.js`), avec un message d'erreur affiché directement sous le champ concerné si le format est incorrect.
5. **Génération de la demande** – Une fois le formulaire complété, un résumé est affiché à l'écran et un courriel pré-rempli est généré avec le détail de la demande, prêt à être envoyé à l'entreprise.

Exemple de logique de validation :

```js
function isValidPhone(v){
  var digits = v.replace(/\D/g, '');
  if(digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
  if(digits.length !== 10) return false;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
}
```

## 📁 Structure

```
kozy-klean-site/
│
├── index.html          → la page (structure HTML uniquement)
├── assets/
│   ├── style.css        → toute l'apparence (couleurs, mise en page, animations)
│   ├── script.js         → toute la logique (menu, simulateur, validations, effets dynamiques)
│   └── consent.js        → bannière de consentement (Loi 25) + Microsoft Clarity
├── confidentialite.html → politique de confidentialité (FR) — en/privacy.html, es/privacidad.html
├── favicon.svg          → l'icône du site (onglet du navigateur)
├── og-image.jpg         → l'image affichée quand le site est partagé sur Facebook/LinkedIn/etc.
├── robots.txt           → autorise les moteurs de recherche à indexer le site
├── sitemap.xml          → liste des pages du site, pour aider Google à les trouver
└── README.md
```

## ⚙️ Installation / aperçu local

Aucune installation n'est requise : pas de build, pas de dépendances à gérer.

1. Cloner le dépôt :

```bash
git clone https://github.com/<votre-utilisateur>/kozyklean.git
cd kozyklean
```

2. Ouvrir `index.html` directement dans un navigateur pour un aperçu local (double-clic, ou glisser-déposer le fichier dans une fenêtre de navigateur).

## 🚀 Déploiement

**Mettre le projet sur GitHub :**

```bash
git init
git add .
git commit -m "Premier envoi du site Kozy & Klean"
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/kozyklean.git
git push -u origin main
```

**Héberger gratuitement sur Netlify — option rapide (glisser-déposer) :**
1. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisser tout le dossier du projet dans la zone de dépôt
3. Le site est en ligne en quelques secondes, avec une adresse du type `nom-au-hasard.netlify.app`
4. Dans **Site settings → Change site name**, remplacer ce nom par quelque chose comme `kozyklean.netlify.app`

**Option recommandée à long terme (connectée à GitHub, mises à jour automatiques) :**
1. Pousser d'abord le projet sur GitHub (étapes ci-dessus)
2. Sur Netlify : **Add new site → Import an existing project**
3. Choisir GitHub, puis le dépôt `kozyklean`
4. Laisser "Build command" vide et "Publish directory" sur `/`
5. Cliquer **Deploy** — à chaque `git push`, Netlify republiera automatiquement le site

**Alternative : GitHub Pages**
Dans le dépôt sur GitHub : **Settings → Pages**, choisir la branche `main` et le dossier `/ (root)`. Le site sera en ligne à `https://<votre-utilisateur>.github.io/kozyklean/`.

## 🔍 Référencement (SEO) déjà en place

* Balises meta description, mots-clés et Open Graph/Twitter (aperçu soigné quand le lien est partagé)
* Données structurées `LocalBusiness` (schema.org) pour aider Google à comprendre qu'il s'agit d'une entreprise locale à Sainte-Foy
* `robots.txt` et `sitemap.xml` pour l'indexation
* Image de partage social dédiée (`og-image.jpg`)

**Important : remplacer le domaine partout avant la mise en ligne.** Le fichier utilise actuellement `https://www.kozyklean.ca/` comme adresse provisoire. Une fois le site en ligne (adresse Netlify du type `kozyklean.netlify.app`, ou un domaine personnalisé), remplacer cette adresse partout où elle apparaît :
* `index.html` : balise `<link rel="canonical">`, toutes les balises `og:url`, `og:image`, `twitter:image`, et le bloc de données structurées à la fin du `<head>`
* `robots.txt` : la ligne `Sitemap:`
* `sitemap.xml` : la balise `<loc>`

## 📝 À personnaliser avant la mise en ligne

1. **Coordonnées de contact** — dans `assets/script.js`, chercher `CONTACT_EMAIL =` près du début du fichier, et confirmer que `CONTACT_EMAIL`, `CONTACT_PHONE_DISPLAY`, `CONTACT_PHONE_TEL`, `CONTACT_PHONE_DISPLAY_2` et `CONTACT_PHONE_TEL_2` correspondent bien aux coordonnées actives de l'entreprise.
2. **Vérification finale** — tester le simulateur de soumission de bout en bout pour confirmer que le résumé affiché et le courriel généré sont corrects.

## 📊 Statistiques de visite (Microsoft Clarity) et conformité Loi 25

Le site mesure les visites avec **Microsoft Clarity** (gratuit, sans limite de trafic) : nombre de visites, pages vues, temps d'engagement, profondeur de défilement, **cartes de chaleur** (où les gens cliquent, jusqu'où ils descendent) et **relectures de visites** (le parcours de la souris et le défilement, comme une vidéo).

**Rien n'est chargé sans le consentement du visiteur** (Loi 25, art. 8.1) : une bannière FR/EN/ES propose « Refuser » et « Accepter » avec le même poids visuel, plus « Personnaliser ». Le visiteur peut changer d'avis en tout temps (« Gérer mes témoins » dans le pied de page).

### Fichiers concernés

* `assets/consent.js` → bannière de consentement + chargement de Clarity **seulement après « Accepter »**
* `confidentialite.html`, `en/privacy.html`, `es/privacidad.html` → politique de confidentialité (obligatoire, Loi 25 art. 8.2)
* `assets/style.css` → section « Confidentialité (Loi 25) » en fin de fichier
* `index.html`, `en/index.html`, `es/index.html` → liens du pied de page, avis sous les formulaires, masquage `data-clarity-mask="True"` des zones contenant des renseignements personnels

### Activer Clarity (5 minutes)

1. Aller sur [clarity.microsoft.com](https://clarity.microsoft.com/) → se connecter (compte Microsoft, Google ou Facebook de l'entreprise) → **Add new project** → nom `Kozy & Klean`, URL `https://kozyklean.netlify.app`.
2. Choisir l'installation **manuelle** (« Install manually ») mais **ne PAS coller le code proposé dans le site** : il chargerait Clarity sans consentement. Copier seulement le **Project ID** (Settings → Overview, une dizaine de caractères).
3. Dans `assets/consent.js`, remplacer `COLLEZ_VOTRE_ID_CLARITY` par ce Project ID, puis publier.
4. Dans Clarity → **Settings → Masking** : garder le mode **Balanced** (ou **Strict** pour masquer tout le texte). Les formulaires sont de toute façon masqués par le code.
5. Dans Clarity → **Settings → Setup** : mettre le réglage **Cookies** à **OFF** (mode consentement). Double sécurité : Clarity ne pose alors aucun témoin tant que la bannière ne lui a pas transmis l'accord du visiteur, ce que `consent.js` fait automatiquement après « Accepter ». Ne jamais utiliser `clarity('identify', …)` avec un nom, un courriel ou un téléphone.
6. Tester : ouvrir le site en navigation privée → « Accepter » → le tableau de bord Clarity reçoit la visite en quelques minutes à quelques heures.

### Où lire les résultats dans Clarity

* **Dashboard** : visites, pages par visite, temps d'engagement, profondeur de défilement, clics de rage, clics morts, retours rapides.
* **Heatmaps** : choisir une page (FR, EN, ES) → onglets *Click* et *Scroll* pour voir ce qui retient l'attention et où les visiteurs arrêtent de lire.
* **Recordings** : relecture de visites (souris, défilement, clics). Les formulaires apparaissent masqués.
* **Filtres → Custom events** : `soumission_etape_2` à `soumission_etape_5`, `soumission_envoyee`, `message_rapide_envoye`, `clic_telephone`, `clic_courriel`, `clic_facebook`. Parfait pour voir à quelle étape du simulateur les gens abandonnent. Filtre personnalisé `langue` = fr / en / es.

> Seuls les visiteurs qui acceptent sont comptés : c'est le prix de la conformité. Les chiffres réels de fréquentation sont donc un peu plus élevés que ce qu'affiche Clarity.

### Obligations Loi 25 qui ne se règlent pas dans le code (à faire par l'entreprise)

* **Responsable de la protection des renseignements personnels** : par défaut, la personne ayant la plus haute autorité dans l'entreprise. Son titre et ses coordonnées sont publiés dans la politique (section 1).
* **Évaluation des facteurs relatifs à la vie privée (EFVP)** avant de communiquer des renseignements hors Québec (Netlify, EmailJS, Gmail, Clarity sont aux États-Unis) : une courte évaluation écrite, conservée à l'interne (**ne pas la mettre dans ce dépôt public**).
* **Respecter ce que la politique promet** : supprimer les demandes sans suite après 12 mois, activer l'authentification à deux facteurs sur Gmail, EmailJS, Netlify, GitHub et Clarity, tenir un registre des incidents de confidentialité (même vide).
* **Changer d'outil = mettre à jour** : si vous ajoutez un nouvel outil (ex. pixel Facebook, Google Analytics), l'ajouter dans la politique, dans la bannière, et augmenter `CONSENT_VERSION` dans `assets/consent.js` pour redemander le consentement à tout le monde.

## 🔗 Lien vers le site en ligne

*(à compléter une fois le site déployé sur Netlify ou un domaine personnalisé)*

## 📇 Contact

**Kozy & Klean Conciergerie Nomade**
📧 [kozyklean.info@gmail.com](mailto:kozyklean.info@gmail.com)
