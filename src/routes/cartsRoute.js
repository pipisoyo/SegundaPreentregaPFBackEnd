import CartsManager from "../dao/services/cartManager.js";
import express from "express"

const cartsManager = new CartsManager();
const cartsRoutes = express.Router()

cartsRoutes.get("/:cid", async (req, res) => {

  const cid = req.params.cid;

  try {
    const cart = await cartsManager.getCartById(cid);
    return res.json({ cart });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
})

cartsRoutes.post("/", async (req, res) => {

  try {
    const newCart = await cartsManager.createCart();
    return res.json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).send("Error al crear el carrito");
  }
})

cartsRoutes.post("/:cid/product/:pid/", async (req, res) => {

  const pid = req.params.pid
  const cid = req.params.cid
  const quantity = 1;


  try {
    const cart = await cartsManager.getCartById(cid);
    if (!cart || cart.length === 0) {
      cart = await cartsManager.createCart()
    }
    await cartsManager.addProduct(cid, pid, quantity);
    res.send('Producto agregado al carrito');
  } catch (error) {
    console.error("Error al intentar agregar el producto al carrito", error);
    res.status(500).send("Error al intentar agregar el producto al carrito");
  }
});

cartsRoutes.delete('/:cid/products/:pid', async (req, res) => {

  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartsManager.deleteProduct(cid, pid);
    res.send('Producto eliminado del carrito');
  } catch (error) {
    console.error("Error al intentar eliminar el producto del carrito", error);
    res.status(500).send("Error al intentar eliminar el producto del carrito");
  }
});

cartsRoutes.put('/:cid', async (req, res) => {

  const cid = req.params.cid;
  const products = req.body.products;

  try {
    await cartsManager.updateCart(cid, products);
    res.send('Carrito actualizado');
  } catch (error) {
    console.error("Error al intentar eliminar el producto del carrito", error);
    res.status(500).send("Error al intentar eliminar el producto del carrito");
  }
});

cartsRoutes.put('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await cartsManager.updateQuantity(cid, pid, quantity);
    res.send('Cantidad de producto actualizada');
  } catch (error) {
    console.error("Error al intentar actualizar la cantidad del producto", error);
    res.status(500).send("Error al intentar actualizar la cantidad del producto");
  }
});

cartsRoutes.delete('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const products = [];
  try {
    await cartsManager.updateCart(cid, products);
    res.send('Todos los productos eliminados del carrito');
  } catch {
    console.error("Error al intentar eliminar los productos del carrito", error);
    res.status(500).send("Error al intentar eliminar los productos del carrito");
  }
});

export default cartsRoutes;