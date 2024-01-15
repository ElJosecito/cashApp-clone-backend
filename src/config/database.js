//load mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      const uri = `${process.env.MONGO_URL}/${process.env.MONGO_DB}`;

      await mongoose.connect(uri);
  
      console.log('Conexión exitosa a MongoDB');
    } catch (error) {
      console.error('Error de conexión a MongoDB:', error.message);
      process.exit(1); 
    }
  };

module.exports = connectDB;