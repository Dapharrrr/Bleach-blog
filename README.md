# Bleach Blog - Full Stack Application

Ce repository contient l'application complète Bleach Blog avec :

## 🏗️ Structure du projet

```
├── bleach-blog/           # Backend API (Strapi CMS)
│   ├── src/
│   ├── config/
│   └── package.json
├── bleach-blog-frontend/  # Frontend (Next.js)
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v18 ou <=22.xx.xx)
- npm ou yarn

### Installation

1. **Clone le repository**
   ```bash
   git clone <votre-repo-url>
   cd Bleach-blog
   ```

2. **Backend (Strapi)**
   ```bash
   cd bleach-blog
   npm install
   npm run develop
   ```
   L'API sera disponible sur `http://localhost:1337`

3. **Frontend (Next.js)**
   ```bash
   cd bleach-blog-frontend
   npm install
   npm run dev
   ```
   L'application sera disponible sur `http://localhost:3000`

## 🛠️ Technologies utilisées

### Backend
- **Strapi** - CMS headless
- **Node.js** - Runtime

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **CSS Modules** - Styles

## 📝 Fonctionnalités

- ✅ Affichage des articles en grille
- ✅ Page de détail d'article
- ✅ Gestion des images (vignettes)
- ✅ Responsive design
- ✅ API REST complète

## 🔧 Configuration

### Variables d'environnement

**Backend (`bleach-blog/.env`)**
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
```

**Frontend (`bleach-blog-frontend/.env.local`)**
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 📚 Documentation

- [Documentation Strapi](https://docs.strapi.io/)
- [Documentation Next.js](https://nextjs.org/docs)

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request