# Kozy & Klean — site web

Site vitrine de **Kozy & Klean Conciergerie Nomade** (Sainte-Foy, Québec).

## Structure du projet

```
index.html          → la page (structure HTML uniquement)
assets/style.css     → toute l'apparence (couleurs, mise en page, animations)
assets/script.js     → toute la logique (menu, formulaire, effets dynamiques)
favicon.svg          → l'icône du site (onglet du navigateur)
og-image.png         → l'image affichée quand le site est partagé sur Facebook/LinkedIn/etc.
robots.txt           → autorise les moteurs de recherche à indexer le site
sitemap.xml          → liste des pages du site, pour aider Google à les trouver
```

Pas de build, pas de dépendances à installer : les polices viennent de Google Fonts (via internet) et toutes les images du contenu sont déjà intégrées. Vous pouvez ouvrir `index.html` en double-cliquant dessus pour un aperçu local, ou déposer tout le dossier sur n'importe quel hébergeur de site statique.

## Référencement (SEO) déjà en place

- Balises meta description, mots-clés et Open Graph/Twitter (aperçu soigné quand le lien est partagé)
- Données structurées `LocalBusiness` (schema.org) pour aider Google à comprendre qu'il s'agit d'une entreprise locale à Sainte-Foy
- `robots.txt` et `sitemap.xml` pour l'indexation
- Image de partage social dédiée (`og-image.png`)

**Important : remplacez le domaine partout avant la mise en ligne.** Le fichier utilise actuellement `https://www.kozyklean.ca/` comme adresse provisoire. Une fois votre site en ligne (adresse Netlify du type `kozyklean.netlify.app`, ou un domaine personnalisé), remplacez cette adresse partout où elle apparaît :
- `index.html` : balise `<link rel="canonical">`, toutes les balises `og:url`, `og:image`, `twitter:image`, et le bloc de données structurées à la fin du `<head>`
- `robots.txt` : la ligne `Sitemap:`
- `sitemap.xml` : la balise `<loc>`

Une recherche/remplacement de `https://www.kozyklean.ca/` par votre vraie adresse (avec un éditeur de texte, ou la fonction "Rechercher dans les fichiers" de VS Code) suffit.

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

Remplacez `<votre-utilisateur>` et `<nom-du-depot>` par les vôtres. GitHub vous demandera de vous authentifier avec un jeton d'accès personnel ("Personal Access Token") plutôt qu'un mot de passe ; GitHub vous guide au moment du push si besoin.

## Héberger gratuitement sur Netlify

Vous avez déjà un compte Netlify (utilisé pour le projet sosabeillesguyane) : Kozy & Klean sera un **site séparé et indépendant** sur ce même compte, avec son propre quota d'heures de build gratuit — le fait que sosabeillesguyane affiche "running on operational credits" n'affecte pas ce nouveau site.

**Option la plus rapide (glisser-déposer, sans passer par GitHub) :**
1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glissez tout le dossier du projet (le dossier qui contient `index.html`, `assets/`, etc.) dans la zone de dépôt
3. Le site est en ligne en quelques secondes, avec une adresse du type `nom-au-hasard.netlify.app`
4. Dans **Site settings → Change site name**, vous pouvez remplacer ce nom par quelque chose comme `kozyklean.netlify.app`

**Option recommandée à long terme (connectée à GitHub, mises à jour automatiques) :**
1. Poussez d'abord le projet sur GitHub (étapes ci-dessus)
2. Sur Netlify : **Add new site → Import an existing project**
3. Choisissez GitHub, puis le dépôt `kozyklean` (ou le nom que vous avez choisi)
4. Laissez "Build command" vide et "Publish directory" sur `/` (aucune commande de build n'est nécessaire, le site est déjà prêt tel quel)
5. Cliquez **Deploy** — à chaque `git push` par la suite, Netlify republiera automatiquement le site

**Alternative : GitHub Pages (gratuit, directement depuis GitHub, sans Netlify)**
Dans le dépôt sur GitHub : **Settings → Pages**, puis sous "Build and deployment", choisissez la branche `main` et le dossier `/ (root)`. Le site sera en ligne à une adresse du type `https://<votre-utilisateur>.github.io/<nom-du-depot>/`.

## Domaine personnalisé

Une fois hébergé (Netlify ou GitHub Pages), vous pourrez brancher un nom de domaine personnalisé (par exemple `kozyetklean.ca`) directement depuis les paramètres de l'hébergeur, si vous en achetez un plus tard. N'oubliez pas de mettre à jour les adresses mentionnées dans la section SEO ci-dessus une fois ce domaine actif.

## À personnaliser avant la mise en ligne

Trois choses restent à compléter avant de publier officiellement :

1. **Coordonnées de contact** — dans `assets/script.js`, cherchez `CONTACT_EMAIL =` près du début du fichier, et remplacez `CONTACT_EMAIL`, `CONTACT_PHONE_DISPLAY`, `CONTACT_PHONE_TEL` et `CONTACT_WHATSAPP` par vos vraies coordonnées. Le même numéro de téléphone provisoire (`+1-418-000-0000`) apparaît aussi dans le bloc de données structurées à la fin du `<head>` d'`index.html` — à mettre à jour également.
2. **Lien Facebook** — cherchez `id="fbLink"` dans le pied de page d'`index.html`, et `sameAs` dans le bloc de données structurées, et remplacez l'adresse par le lien direct vers votre page Facebook.
3. **Vérification finale** — une fois les vraies coordonnées en place, testez le formulaire de soumission (section "Demande de soumission") pour confirmer que le courriel et le message WhatsApp générés sont corrects.
