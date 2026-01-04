# ChuZone Frontend - React Application

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000) dans le navigateur.

### Tests

```bash
# Exécuter les tests
npm test

# Avec couverture
npm run test:coverage
```

### Build Production

```bash
npm run build
```

### Docker

```bash
# Build l'image
docker build -t chuzone-frontend .

# Exécuter le conteneur
docker run -p 8080:80 chuzone-frontend
```

Accédez à [http://localhost:8080](http://localhost:8080)

## 📦 Fonctionnalités

- ✅ Gestion de produits (CRUD)
- ✅ Persistance avec localStorage
- ✅ Filtrage par catégorie
- ✅ Statistiques en temps réel
- ✅ Design responsive
- ✅ Tests unitaires complets

## 🧪 Tests

L'application inclut des tests pour:
- Rendu des composants
- Formulaires et validation
- Ajout/suppression de produits
- LocalStorage
- Filtres
- Statistiques
- Accessibilité

## 🏗️ Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Composant principal
│   ├── App.css         # Styles
│   ├── App.test.js     # Tests
│   ├── index.js        # Entry point
│   └── index.css       # Styles globaux
├── Dockerfile          # Image Docker
├── nginx.conf          # Config Nginx
└── package.json        # Dependencies
```

## 🎨 Technologies

- React 18
- CSS3 (Gradient & Grid)
- Jest & Testing Library
- Nginx (Production)
- Docker
