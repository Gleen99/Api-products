export default {
    PORT: parseInt(process.env.PORT || '17301'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/products',
};
