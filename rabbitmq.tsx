import amqp from 'amqplib';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

class RabbitMQClient {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect() {
    try {
      const { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USERNAME, RABBITMQ_PASSWORD } = process.env;

      const url = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Error connecting to RabbitMQ', error);
    }
  }

  async publishMessage(queue: string, message: string, options?: amqp.Options.Publish) {
    if (!this.channel) {
      throw new Error('Channel not established');
    }
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message), options);
  }

  async consumeMessage(queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) {
    if (!this.channel) {
      throw new Error('Channel not established');
    }
    await this.channel.assertQueue(queue, { durable: false });
    await this.channel.consume(queue, callback, { noAck: true });
  }

  async closeConnection() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
  async setup() {
    if (!this.channel) {
      throw new Error('Channel not established');
    }
    await this.channel.assertQueue('get_products_details', { durable: false });
    await this.channel.assertQueue('products_details_response', { durable: false });
  }

}

export const rabbitMQClient = new RabbitMQClient();