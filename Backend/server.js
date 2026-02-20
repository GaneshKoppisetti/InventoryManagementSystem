const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/config');
connectToDB();
const app = express();
const port = process.env.PORT;
// Default Middleware
// app.use(cors('*')); This is incorrect for credential-based authentication.
app.use(cors({
  origin: "http://localhost:5173",// Front end
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());
// Routes
const roleRoutes = require('./routes/roleRoute');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');

app.use((req, res,next) => {
  //console.log(`req.cookies.refreshToken: ${req.cookies.refreshToken}`)
  // res.send('Inventory Management System API');
  next();
})
// API Endpoints
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);



app.get('/', (req, res) => {
  //console.log(`req.cookies.accessToken: ${req.cookies.accessToken}`)
  res.send('Inventory Management System API');
});
 app.listen(port ,()=> {
   console.log(`Server is running on port ${port}`);
 });
