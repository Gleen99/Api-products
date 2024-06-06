import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import produitRoutes from './src/routes/ProduitsRoutes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/produits', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions)

    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB', err));

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
    console.log('Connexion à MongoDB réussie');
});

mongoose.connection.on('error', err => {
    console.error('Erreur de connexion MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Connexion à MongoDB interrompue');
});

// // Fermeture de la connexion lors de l'arrêt de l'application
// process.on('SIGINT', () => {
//     mongoose.connection.close(() => {
//         console.log('Connexion à MongoDB fermée lors de l\'arrêt de l\'application');
//         process.exit(0);
//     });
// });

// Routes
app.use('/api/produits', produitRoutes);

// Gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur est survenue' });
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
// Route pour la documentation Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));