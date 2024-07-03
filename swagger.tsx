import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Produits',
        version: '1.0.0',
        description: 'API pour la gestion des produits'
    },
    servers: [
        {
            url: 'http://localhost:17301/api/v1',
            description: 'Serveur de développement',
        }
    ],
    components: {
        schemas: {
            Produit: {
                type: 'object',
                properties: {
                    nom: {
                        type: 'string'
                    },
                    description: {
                        type: 'string'
                    },
                    prix: {
                        type: 'number'
                    },
                    categorie: {
                        type: 'string'
                    }
                },
                required: ['nom', 'description', 'prix', 'categorie']
            }
        },
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'X-API-Key'
            }
        },
        security: [{
            ApiKeyAuth: []
        }]
    }

};

const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    apis: ['./src/routes/*.tsx']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;