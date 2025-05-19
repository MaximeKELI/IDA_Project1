# Système de Gestion des Cours (Course Management System)

## Description
Ce projet est un système complet de gestion des cours qui permet aux administrateurs et aux enseignants de gérer efficacement les cours, les salles et les départements (filières) au sein d'un établissement d'enseignement. Le système est construit avec une architecture moderne utilisant un frontend JavaScript et un backend .NET Core.

## Fonctionnalités Principales
- ✅ Gestion complète des cours
- ✅ Attribution des salles
- ✅ Gestion des filières
- ✅ Génération de rapports PDF
- ✅ Interface utilisateur intuitive
- ✅ API RESTful

## Structure du Projet
```
IDA_Projet1/
├── frontend/
│   ├── ida.js         # Logique principale du frontend
│   ├── api.js         # Gestion des appels API
│   └── styles/        # Fichiers CSS et styles
├── backend/
│   └── GestionSalles/
│       ├── Controllers/   # Contrôleurs API
│       ├── Models/        # Modèles de données
│       └── Services/      # Services métier
```

## Prérequis Techniques
- .NET Core SDK (version 6.0 ou supérieure)
- Node.js et npm
- Base de données SQL Server
- Navigateur web moderne

## Installation

### Backend (.NET Core)
1. Naviguez vers le dossier backend :
```bash
cd backend/GestionSalles
```

2. Restaurez les packages :
```bash
dotnet restore
```

3. Appliquez les migrations de base de données :
```bash
dotnet ef database update
```

4. Démarrez le serveur :
```bash
dotnet run
```

### Frontend
1. Naviguez vers le dossier frontend :
```bash
cd frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez l'application :
```bash
npm start
```

## Configuration
- Le fichier de configuration du backend se trouve dans `backend/GestionSalles/appsettings.json`
- Les variables d'environnement du frontend sont dans `.env`

## API Endpoints

### Cours
- GET `/api/cours` - Liste tous les cours
- POST `/api/cours` - Ajoute un nouveau cours
- GET `/api/cours/{id}` - Récupère un cours spécifique
- PUT `/api/cours/{id}` - Met à jour un cours
- DELETE `/api/cours/{id}` - Supprime un cours

### Filières
- GET `/api/filieres` - Liste toutes les filières
- POST `/api/filieres` - Ajoute une nouvelle filière

### Salles
- GET `/api/salles` - Liste toutes les salles
- POST `/api/salles` - Ajoute une nouvelle salle

## Fonctionnalités Détaillées

### Gestion des Cours
Le système permet de :
- Créer de nouveaux cours avec tous les détails nécessaires
- Assigner des salles aux cours
- Associer des cours à des filières
- Générer des rapports PDF des cours
- Visualiser tous les cours dans une interface conviviale

### Génération de PDF
- Génération automatique de rapports PDF pour les cours
- Inclusion des détails complets du cours
- Format professionnel et lisible

## Sécurité
- Validation des données côté serveur
- Protection contre les injections SQL
- Gestion sécurisée des sessions

## Bonnes Pratiques
- Utilisation de modèles de conception standards
- Code documenté et maintenable
- Architecture en couches
- Validation des données

## Dépannage
### Problèmes Courants
1. **Erreur "N/A" dans l'affichage des filières ou salles**
   - Vérifiez que les données sont correctement chargées dans la base de données
   - Assurez-vous que les IDs correspondent entre le frontend et le backend

2. **Erreurs d'API**
   - Vérifiez les logs du serveur
   - Assurez-vous que tous les champs requis sont remplis
   - Validez le format des données envoyées

## Contribution
Pour contribuer au projet :
1. Forkez le repository
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Soumettez une pull request

## Support
Pour toute question ou problème :
- Ouvrez une issue dans le repository
- Contactez l'équipe de développement

## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

# pour clonner : 
```bash
git clone https://github.com/MaximeKELI/IDA_Project1.git
