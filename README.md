# Animations Canvas 2D

Collection d'animations canvas 2D interactives avec contrôles GUI.

## 📦 Utilisation (Version Build)

Le dossier `dist/` contient tous les fichiers compilés prêts à l'emploi.

### Option 1 : Ouvrir directement dans un navigateur
1. Ouvrez le fichier `dist/index.html` dans votre navigateur
2. Cliquez sur les liens pour naviguer entre les animations

### Option 2 : Serveur local simple
Si les liens ne fonctionnent pas directement, utilisez un serveur local :

```bash
cd dist
python3 -m http.server 8000
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

## 🎨 Animations disponibles

- **Ellipses Déformées** - Ellipses qui se déforment et tournent
- **Rectangles Animés** - Rectangles en rotation avec variations de taille
- **Ondes Sinusoïdales** - Ondes sinusoïdales superposées
- **Sphère Céleste 3D** - Sphère galactique avec rotation 3D
- **Courbes de Lissajous** - Grille de patterns mathématiques
- **Perspective 3D Cube** - Cube en perspective avec rotation

Chaque animation dispose d'un panneau de contrôle (GUI) pour ajuster les paramètres en temps réel.

## 🛠️ Développement

Pour modifier les animations :

```bash
npm install
npm run dev
```

Pour rebuild :

```bash
npm run build
```
