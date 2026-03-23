# KhedmaLink 🔧⚡🪚🔩

> Plateforme de mise en relation entre clients et artisans locaux — Agadir, Maroc 🇲🇦

## 📱 Aperçu

**KhedmaLink** est une application web mobile-first qui connecte les clients avec des artisans locaux (plombiers, électriciens, menuisiers, soudeurs) de manière rapide et fiable.

## 🛠️ Technologies

- ⚛️ React 18 + Vite
- 🎨 Tailwind CSS v3
- 🔄 React Router v6
- 📦 Context API
- 🎭 Lucide React

## 📁 Structure

```
src/
├── components/   Navbar, ArtisanCard, CategoryCard, StarRating
├── pages/        Login, Home, ArtisanProfile, Booking, Bookings, Chat, Rating, Dashboard, Profile
├── context/      AppContext (auth + state global)
└── data/         artisans.json, categories.json
```

## 🚀 Lancement

```bash
npm install
npm run dev
```

## ✅ Fonctionnalités

- 🔐 Auth (Client / Artisan) + routes protégées
- 🏠 Accueil avec recherche, catégories, mode urgence
- 👤 Profil artisan complet avec avis
- 📅 Réservation (date, heure, service, adresse)
- ⭐ Évaluation interactive
- 💬 Chat simulé
- 📊 Dashboard artisan (stats, missions, demandes)
- 👤 Profil utilisateur

## 🎨 Design

Dark Navy + Teal + Orange — Mobile-first — Plus Jakarta Sans + DM Sans

## 👩‍💻 Auteur

Samira — DEVOWFS, OFPPT Aït Melloul 🇲🇦
