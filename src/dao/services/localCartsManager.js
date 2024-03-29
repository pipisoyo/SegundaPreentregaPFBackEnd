import fs from 'fs';
import __dirname from '../../utils.js';

export class localCartsManager {
  constructor() {
    this.carts = [];
    this.idCounter = 0;
    this.PATH = `${__dirname}/dataBase/carts.json`;
  }

  async handleData() {
    try {
      let data = await fs.promises.readFile(this.PATH, 'utf-8');

      if (data) {
        this.carts = JSON.parse(data);
        const lastCartId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
        this.idCounter = lastCartId;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.promises.writeFile(this.PATH, JSON.stringify(''), null, 2);
        this.carts = [];
        return this.carts;
      } else {
        throw new Error("Error al cargar los datos")
      }
    }
  }

  async saveData() {
    try {
      await fs.promises.writeFile(this.PATH, JSON.stringify(this.carts), null, 2);
    } catch (error) {
      throw new Error("Error al guardar los datos")
    }
  }

  async createCart() {
    await this.handleData();

    const newCart = {
      id: this.idCounter + 1,
      products: [],
    };

    this.carts.push(newCart);
    this.idCounter++;
    await this.saveData();

    return newCart;
  }

  async getCartById(id) {
    await this.handleData();
    const cart = this.carts.find(cart => cart.id == id);
    if (cart) {
      return cart;
    } else {
      return { error: "El carrito no existe", statusCode: 404 };
    }
  }

  async addProductToCart(cartId, productId) {
    await this.handleData();

    const cart = this.carts.find(cart => cart.id == cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const existingProduct = cart.products.find(product => product.id == productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const newProduct = {
        id: productId,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }

    await this.saveData();

    return cart;
  }
}