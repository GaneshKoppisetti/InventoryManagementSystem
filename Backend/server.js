const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/config');
connectToDB();
const app = express();
const port = 4000;
// Default Middleware
app.use(cors('*')); 
app.use(express.json());
// Routes
const roleRoutes = require('./routes/roleRoute');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
// API Endpoints
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});
 app.listen(port ,()=> {
   console.log(`Server is running on port ${port}`);
 });
