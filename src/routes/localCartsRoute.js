import { Router } from "express";
import { localCartsManager } from "../dao/services/localCartsManager.js";

const cartsManager = new localCartsManager();
const localCartsRoute = Router();

localCartsRoute.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).send("Error al crear el carrito");
  }
});

localCartsRoute.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.getCartById(cid);

    if (cart.error) {
      res.status(cart.statusCode).send(cart.error);
      return;
    }

    const products = cart.products;

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
    res.status(500).send("Error al obtener los productos del carrito");
  }
});

localCartsRoute.post("/:cid/product/:pid/", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsManager.getCartById(cid);

    if (cart.error) {
      res.status(cart.statusCode).send(cart.error);
      return;
    }

    const updatedCart = await cartsManager.addProductToCart(cid, pid);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).send("Error al agregar el producto al carrito");
  }
});

export default localCartsRoute;