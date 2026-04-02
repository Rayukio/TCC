require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 3333;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 iFix API running on http://localhost:${PORT}/api/v1`);
  });
};

start();