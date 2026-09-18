# Kozy & Klean — site web

Site vitrine de **Kozy & Klean Conciergerie Nomade** (Sainte-Foy, Québec).

Tout le site tient dans un seul fichier autonome : `index.html`. Pas de build, pas de dépendances à installer — les polices viennent de Google Fonts et les images (les illustrations de l'affiche) sont intégrées directement dans le fichier. Vous pouvez l'ouvrir en double-cliquant dessus, ou le déposer sur n'importe quel hébergeur de site statique.

## Mettre le projet sur GitHub

Dans un terminal, à l'intérieur de ce dossier :

```bash
git init
git add .
git commit -m "Premier envoi du site Kozy & Klean"
```

Ensuite, créez un dépôt vide sur GitHub (bouton **New repository** sur github.com — ne cochez pas "Add a README", puisque vous en avez déjà un), puis :

```bash
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/<nom-du-depot>.git
git push -u origin main
```

Remplacez `<votre-utilisateur>` et `<nom-du-depot>` par les vôtres. GitHub vous demandera de vous authentifier (avec un jeton d'accès personnel — "Personal Access Token" — plutôt qu'un mot de passe ; GitHub vous guide au moment du push si besoin).

## Héberger le site (gratuit)

Trois options simples, du plus rapide au plus "professionnel" :

**Netlify (glisser-déposer, sans compte GitHub requis)**
Allez sur [app.netlify.com/drop](https://app.netlify.com/drop) et déposez le dossier du projet (ou juste `index.html`). Le site est en ligne en quelques secondes, avec une adresse `.netlify.app`. C'est la même plateforme que celle utilisée pour sosabeillesguyane.

**Netlify (connecté à GitHub, mises à jour automatiques)**
Une fois le dépôt poussé sur GitHub, sur Netlify choisissez **Add new site → Import an existing project**, reliez le dépôt, et laissez le paramètre "Publish directory" vide ou sur `/` (aucune commande de build nécessaire). Chaque `git push` republie automatiquement le site.

**GitHub Pages (gratuit, directement depuis GitHub)**
Dans le dépôt sur GitHub : **Settings → Pages**, puis sous "Build and deployment", choisissez la branche `main` et le dossier `/ (root)`. Le site sera en ligne à une adresse du type `https://<votre-utilisateur>.github.io/<nom-du-depot>/`.

## Domaine personnalisé

Une fois hébergé (Netlify ou GitHub Pages), vous pourrez brancher un nom de domaine personnalisé (par exemple `kozyetklean.ca`) directement depuis les paramètres de l'hébergeur, si vous en achetez un plus tard.

## À personnaliser avant la mise en ligne

Trois choses restent à compléter directement dans `index.html` avant de publier officiellement :

1. **Coordonnées de contact** — cherchez `CONTACT_EMAIL`, `CONTACT_PHONE_DISPLAY`, `CONTACT_PHONE_TEL` et `CONTACT_WHATSAPP` près du début du bloc `<script>` (recherchez `CONTACT_EMAIL =`), et remplacez les valeurs actuelles par vos vraies coordonnées.
2. **Lien Facebook** — cherchez `id="fbLink"` dans le pied de page et remplacez l'adresse par le lien direct vers votre page Facebook.
3. **Vérification finale** — une fois les vraies coordonnées en place, testez le formulaire de soumission (section "Demande de soumission") pour confirmer que le courriel et le message WhatsApp générés sont corrects.
