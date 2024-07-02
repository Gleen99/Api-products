# API Produits - PayeTonKawa

Ce projet implémente une API RESTful pour la gestion des produits, conformément aux exigences du cahier des charges de PayeTonKawa. L'API est développée avec Node.js, TypeScript et MongoDB, en suivant une architecture micro-services.

## Prérequis

- Node.js (version 14.x ou supérieure)
- npm (version 6.x ou supérieure)
- MongoDB (version 4.x ou supérieure)
- Docker (optionnel, pour le déploiement conteneurisé)

## Installation

1. Clonez le dépôt Git : `git clone https://github.com/Gleen99/Api-products`
2. Accédez au répertoire du projet : `cd api-produits`
3. Installez les dépendances : `npm install`

## Configuration

1. Copiez le fichier `.env.example` en `.env`
2. Modifiez les variables d'environnement dans le fichier `.env` selon votre configuration

## Démarrage

1. Assurez-vous que MongoDB est en cours d'exécution.
2. Démarrez l'application : `npm start`
3. L'API sera accessible à l'adresse `http://localhost:17301/api/v1/products`

## Fonctionnalités

- Opérations CRUD sur les produits
- Validation des données
- Gestion des erreurs
- Logging avec Winston
- Intégration avec RabbitMQ pour la synchronisation des données
- Sécurité avec Helmet et rate limiting

## Endpoints de l'API

L'API Produits expose les endpoints suivants :

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /api/v1/products | Récupère une liste de produits |
| GET | /api/v1/products/{id} | Récupère un produit spécifique par son identifiant |
| POST | /api/v1/products | Crée un nouveau produit |
| PUT | /api/v1/products/{id} | Met à jour les informations d'un produit existant |
| DELETE | /api/v1/products/{id} | Supprime un produit |


## Tests



## Tests manuels avec Postman

Une collection Postman avec des exemples de requêtes est fournie dans le dossier `tests` du projet. Importez le fichier `api-produits.postman_collection.json` dans Postman pour accéder aux requêtes prédéfinies.

## Monitoring

L'API inclut des fonctionnalités de monitoring pour suivre :
- Le nombre d'appels HTTP
- Les codes HTTP de retour
- Les temps moyens d'exécution des appels HTTP

Ces métriques sont accessibles via les logs et peuvent être intégrées à des outils de monitoring externes.

## Déploiement

L'application est packagée sous forme d'image Docker pour faciliter le déploiement. Consultez le `Dockerfile` pour plus de détails.

## Intégration Continue / Déploiement Continu (CI/CD)

Le projet utilise GitFlow pour la gestion des branches. Les pipelines CI/CD sont configurés pour exécuter automatiquement les tests, vérifier la qualité du code et construire l'image Docker.

## Sécurité

- L'API utilise Helmet pour sécuriser les en-têtes HTTP
- Un rate limiting est mis en place pour prévenir les abus
- Les entrées utilisateur sont validées pour prévenir les injections

## Gestion du code source

Le projet suit les principes de GitFlow. Assurez-vous de créer des branches appropriées (feature, release, hotfix) lors du développement de nouvelles fonctionnalités ou de corrections de bugs.
