# Envoi automatique des soumissions — guide de configuration

Le site est prêt côté code : le formulaire de soumission et le message rapide
essaient d'envoyer un vrai courriel via **EmailJS** (gratuit, sans serveur,
compatible avec GitHub Pages). Tant que les 4 valeurs ci-dessous ne sont pas
remplacées dans `assets/script.js`, le site retombe automatiquement sur
l'ancien comportement (un lien `mailto:` que la cliente doit envoyer
elle-même) — donc rien n'est cassé en attendant.

```js
// assets/script.js, tout en haut du fichier
var EMAILJS_PUBLIC_KEY = "COLLEZ_VOTRE_PUBLIC_KEY";
var EMAILJS_SERVICE_ID = "COLLEZ_VOTRE_SERVICE_ID";
var EMAILJS_TEMPLATE_NOTIF = "COLLEZ_ID_TEMPLATE_NOTIFICATION";
var EMAILJS_TEMPLATE_AUTOREPLY = "COLLEZ_ID_TEMPLATE_CONFIRMATION";
```

## Étape 0 — quelle adresse utiliser pour l'instant ?

`kozyklean.ca` n'est pas encore enregistré, donc `info@kozyklean.ca`
(affiché sur le site) ne reçoit rien pour l'instant. Le plus simple et
100% gratuit : créez dès maintenant une **adresse Gmail dédiée à
l'entreprise** (pas votre Gmail personnel), par exemple
`kozyklean.conciergerie@gmail.com` ou `kozyklean.quebec@gmail.com`.
Cette adresse deviendra :

- la boîte que vous consultez pour les nouvelles demandes, en attendant le
  domaine ;
- le compte connecté à EmailJS (étape 2) ;
- plus tard, une fois `kozyklean.ca` enregistré et une vraie boîte
  `info@kozyklean.ca` créée (Zoho Mail, gratuit — je vous guiderai quand
  vous serez rendus là), il suffira de reconnecter EmailJS à la nouvelle
  boîte et de changer `CONTACT_EMAIL` dans `assets/script.js` : rien
  d'autre à refaire.

Dites-moi l'adresse Gmail que vous avez créée et je mets à jour
`CONTACT_EMAIL` (affiché dans la section Contact, le pied de page et les
données structurées du site) pour qu'il pointe dessus en attendant.

## Étape 1 — créer un compte EmailJS

1. Allez sur [emailjs.com](https://www.emailjs.com/) → *Sign Up* (gratuit,
   200 courriels/mois inclus, largement assez pour démarrer).
2. Confirmez votre courriel.

## Étape 2 — connecter votre Gmail comme service d'envoi

1. Dans le tableau de bord EmailJS : **Email Services → Add New Service**.
2. Choisissez **Gmail**, connectez-vous avec l'adresse créée à l'étape 0 et
   autorisez EmailJS.
3. Notez le **Service ID** généré (ex. `service_abc1234`) →
   `EMAILJS_SERVICE_ID`.

## Étape 3 — créer les deux gabarits (templates)

Le forfait gratuit inclut 2 gabarits — exactement ce qu'il faut.

### Gabarit A — « Notification » (vous avertit d'une nouvelle demande)

**Email Templates → Create New Template.**

- **To Email** : votre adresse Gmail de l'étape 0 (tapez-la directement,
  pas besoin de variable ici).
- **Reply To** : `{{email}}` *(optionnel — permet de répondre directement à
  la cliente si le courriel a été fourni)*.
- **Subject** : `{{subject}}`
- **Content** (corps du message) :
  ```
  {{message}}
  ```
- Sauvegardez, puis notez le **Template ID** (ex. `template_notif123`) →
  `EMAILJS_TEMPLATE_NOTIF`.

Ce même gabarit sert aussi pour le petit formulaire « Message rapide » du
bas de page.

### Gabarit B — « Confirmation client » (copie envoyée à la cliente)

**Email Templates → Create New Template** (vous pouvez partir du modèle
pré-fait *Auto-Reply*).

- **To Email** : `{{email}}` *(c'est ce qui envoie directement à la
  cliente — voir la [doc officielle EmailJS](https://www.emailjs.com/docs/tutorial/prepare-auto-reply-template/))*.
- **Reply To** : votre adresse Gmail de l'étape 0.
- **Subject** : `Votre demande de soumission — Kozy & Klean`
- **Content** (exemple, à ajuster à votre ton) :
  ```
  Bonjour {{to_name}},

  Merci pour votre demande ! En voici une copie pour vos dossiers :

  {{message}}

  Nous vous recontactons très bientôt pour finaliser votre soumission.

  — L'équipe Kozy & Klean
  ```
- Sauvegardez, puis notez le **Template ID** → `EMAILJS_TEMPLATE_AUTOREPLY`.

## Étape 4 — récupérer la clé publique

**Account → General → Public Key** → `EMAILJS_PUBLIC_KEY`.

## Étape 5 — coller les 4 valeurs dans le code

Ouvrez `assets/script.js`, remplacez les 4 lignes en haut du fichier par vos
vraies valeurs (gardez les guillemets) :

```js
var EMAILJS_PUBLIC_KEY = "user_xxxxxxxxxxxx";
var EMAILJS_SERVICE_ID = "service_abc1234";
var EMAILJS_TEMPLATE_NOTIF = "template_notif123";
var EMAILJS_TEMPLATE_AUTOREPLY = "template_auto456";
```

Sauvegardez, publiez (git push), et testez le formulaire de soumission
au complet sur le site en ligne — vous devriez recevoir le courriel de
notification, et si vous entrez un courriel de test, recevoir aussi la
copie de confirmation.

## Comment ça se comporte sur le site

- La cliente remplit les 5 étapes et clique **« Recevoir ma soumission »**
  → un résumé **modifiable** s'affiche (elle peut corriger un détail
  directement dans le texte).
- Elle clique **« Envoyer ma soumission par courriel »** → c'est à ce
  moment seulement que les courriels partent (celui qu'elle a
  potentiellement corrigé).
- Le bouton devient **« ✓ Soumission envoyée »** et se désactive — pas de
  doublon possible. S'il modifie encore le résumé après l'envoi, le
  bouton se réactive pour renvoyer la version corrigée.
- Si l'envoi échoue (connexion, service mal configuré, etc.), un lien de
  secours `mailto:` apparaît automatiquement.

## Limites du forfait gratuit EmailJS

200 requêtes/mois (chaque soumission avec courriel = 2 requêtes, sans
courriel = 1 seule), soit environ 100 soumissions complètes/mois. Largement
suffisant pour démarrer ; le plan payant le plus proche est 9 $US/mois pour
2 000 requêtes si jamais vous en avez besoin plus tard.
