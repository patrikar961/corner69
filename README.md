# CORNER69

Site vitrine une page, statique, publié avec GitHub Pages.
Thème sombre et néon, image plein écran, animations au défilement et fond sonore.

**En ligne :** https://patrikar961.github.io/corner69/

---

## Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | La page : structure et contenu texte |
| `style.css` | Toute la mise en forme et les animations |
| `script.js` | Les interactions : préchargeur, parallaxe, curseur, compteurs |
| `son.js` | Le fond sonore — **contient le réglage du volume** |
| `bg.jpg` | L'image de fond |
| `ambiance.mp3` | La musique de fond |

---

## Modifier le volume du son

Tout se règle dans **`son.js`**, à la ligne indiquée par le commentaire :

```js
/* ---------------------------------------------------------
   RÉGLAGE DU VOLUME — la seule valeur à modifier.
   0 = muet · 0.2 = discret (par défaut) · 0.35 = fond sonore ·
   0.5 = moyen · 1 = maximum
   --------------------------------------------------------- */
var VOLUME = 0.2;
```

Remplacez `0.2` par la valeur souhaitée, puis validez. La musique démarrera
eau premier clic d'un visiteur, à ce volume, sans qu'il puisse le changer.

| Valeur | Effet |
|---|---|
| `0` | Muet |
| `0.2` | Discret — valeur actuelle |
| `0.35` | Fond sonore présent |
| `0.5` | Bien audible |
| `0.7` | Fort, envahissant |
| `1` | Maximum |

### Comment le modifier depuis GitHub

1. Ouvrir le dépôt et cliquer sur `son.js`
2. Cliquer sur l'icône **crayon** (en haut à droite du fichier)
3. Modifier le nombre après `var VOLUME =`
4. Descendre et cliquer sur **Commit changes**

Le site se met à jour tout seul dans la minute. Si rien ne change à l'écran,
forcer le rafraîchissement avec **Ctrl + Maj + R** (Cmd + Maj + R sur Mac).

---

## Changer les textes

Tout le contenu écrit est dans **`index.html`**. Les passages à personnaliser :

- Le titre et le sous-titre de la page d'accueil (section `.hero`)
- Le paragraphe **À propos** (`id="apropos"`)
- Les quatre cartes **Services** (`id="services"`)
- L'email, le téléphone et les horaires (`id="contact"`)

Le contenu actuel est un exemple : remplacez-le par les vraies informations
avant de montrer le site à un client.

---

## Remplacer les médias

Les deux fichiers `bg.jpg` et `ambiance.mp3` doivent être **à la racine du
dépôt**, à côté de `index.html`, avec ces noms exacts.

Pour les changer : ouvrir le dépôt, **Add file → Upload files**, glisser le
nouveau fichier, puis supprimer l'ancien. Un fichier doit porter le même nom
que celui attendu par le code — sinon rien ne s'affiche.

L'image attendue est au format **9:16** (vertical, 1080 × 1920). Le mp3 doit
être **libre de droits** : une musique sous copyright sur un site public est
un risque juridique.

---

## Activer GitHub Pages

**Settings → Pages**, puis :

- Source : **Deploy from a branch**
- Branche : **main**
- Dossier : **/ (root)**
- **Save**

Le site est en ligne une minute plus tard.

---

## Effets présents

Préchargeur animé · apparition des sections au défilement · parallaxe sur
l'image · halo lumineux qui suit la souris · curseur personnalisé · boutons
magnétiques · cartes inclinées en 3D · compteurs animés · bandeau défilant ·
barre de progression · menu plein écran sur mobile · fond sonore au premier clic.

Le site respecte le réglage système **« réduire les animations »** : tout
s'immobilise pour qui l'active, et le son ne se lance pas tout seul.

---

## Structure du site

```
index.html          structure et contenu
   └─ style.css     apparence
   └─ script.js    animations et interactions
   └─ son.js       musique de fond
```

Le tout est du HTML, CSS et JavaScript simple, sans framework ni dépendance
externe — sauf les polices *Syne* et *Inter*, chargées depuis Google Fonts.

---

## Licence

© 2026 CORNER69. Tous droits réservés.
