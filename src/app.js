//import localRouterProducts from "./routes/localProductsRoute.js";
//import localCartsRoute from "./routes/localCartsRoute.js";
//import { localProductManager } from "./dao/services/localProductManager.js";
import express from "express";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import { Server } from 'socket.io';
import ProductManager from "./dao/services/productManager.js"
import { Router } from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/productsRoute.js";
import cartsRoutes from "./routes/cartsRoute.js";
import messagesModel from "./dao/models/messagess.js";
import viewesRoutes from "./routes/viewesRoutes.js";

//const productManager = new localProductManager();
const app = express();
const PORT = process.env.PORT || 8080 ;
const realTimeProducts = Router();
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/api/products/", localRouterProducts);
//app.use("/api/carts/", localCartsRoute);
app.use("/api/realtimeproducts",realTimeProducts);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRoutes);

app.use(viewesRoutes)

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');

const connectMongoDB = async () => {
  const DB_URL = 'mongodb+srv://backend:wp3pY3V896VQxtfp@ecommerce.zhcscvh.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce';
  const dataBase= 'ecommerce';
  try {
    await mongoose.connect(DB_URL, {dbName: dataBase });
    console.log("Conectado a la base de datos 'ecommerce'");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos", error);
    process.exit();
  }
}

connectMongoDB()


const server = app.listen(PORT,()=>console.log("Server listening in", PORT))
export const io = new Server(server)

io.on('connection', socket => {

  console.log("Cliente realTimeProducts Conectado!");
  socket.on('realTimeProducts', async () => {
    try {
      const products = await productManager.getAll()
      socket.emit('productos', products);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
    }
  });
})

realTimeProducts.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render('realTimeProducts', { products: products });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

const msg = []

io.on('connection', socket =>{

    console.log("Mensageria conectada")

    socket.on('message', async (data) => {
      const message = new messagesModel({
        email: data.user,
        message: data.message,
      });
    
      try {
        await message.save();
        console.log('Mensaje guardado correctamente');
      } catch (error) {
        console.error('Error al guardar el mensaje:', error);
      }
    
      msg.push(data);
      io.emit('messageLogs', msg);
    });

})  

