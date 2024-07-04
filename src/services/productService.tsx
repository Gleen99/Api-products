import { rabbitMQClient } from "../../rabbitmq";
import amqp from 'amqplib';
import Product, {IProduct} from "../models/products/ProductsModels";

export async function fetchProductDetails(productIds: string[]): Promise<IProduct[]> {
    try {
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            console.warn(`Certains produits n'ont pas été trouvés. Demandés: ${productIds.length}, Trouvés: ${products.length}`);
        }
        return products;
    } catch (error) {
        console.error('Erreur lors de la récupération des products depuis la base de données:', error);
        throw error;
    }
}

export async function handleGetProductDetails(msg: amqp.ConsumeMessage | null) {
    if (!msg) return;

    const { productIds, responseQueue, correlationId } = JSON.parse(msg.content.toString());

    try {
        console.log(`Récupération des détails pour les produits: ${productIds.join(', ')}`);
        const productDetails = await fetchProductDetails(productIds);

        console.log('Envoi de la réponse avec les détails des products');
        await rabbitMQClient.publishMessage(
            responseQueue,  // Use the responseQueue provided in the request
            JSON.stringify(productDetails),
            { correlationId }
        );
        await rabbitMQClient.ackMessage(msg);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails des products:', error);
        await rabbitMQClient.publishMessage(
            responseQueue,  // Use the responseQueue provided in the request
            JSON.stringify({ error: 'Erreur lors de la récupération des détails des products' }),
            { correlationId }
        );
        await rabbitMQClient.nackMessage(msg, false, false);
    }
}

export async function setupProductService() {
    try {
        await rabbitMQClient.connect();
        await rabbitMQClient.setup();
        console.log('Configuration du consommateur pour get_products_details');
        await rabbitMQClient.consumeMessage('get_products_details', handleGetProductDetails);
        console.log('Service de products configuré avec succès');
    } catch (error) {
        console.error('Erreur lors de la configuration du service de products:', error);
        throw error;
    }
}