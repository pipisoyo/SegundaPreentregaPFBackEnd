import cartsModel from "../models/carts.js"


export default class CartsManager {

    getCartById = async (id) =>{

        let result = await cartsModel.findById(id).populate('products.product').lean().exec();
        return result
    }
    createCart = async () => {
        let result = await cartsModel.create({})
        return result
    }

    addProduct = async (cid, pid, quantity) => {
        let cart = await cartsModel.findById(cid)
        let product = cart.products.find((product) => {
            return product.product.toString() === pid
        })
        if (product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        return await cart.save();
    }


    deleteProduct = async (cid, pid) => {
        let cart = await cartsModel.findById(cid)
        let productIndex = cart.products.findIndex((product) => product.product.toString() === pid)
      
        if (productIndex === -1) {
          console.log("Producto no encontrado")
          return(error)
        } else {
          cart.products.splice(productIndex, 1)
        }
      
        return await cart.save();
      }

      updateCart = async (cid, newCart) => {
        let cart = await cartsModel.findById(cid);
        cart.products = newCart;
        return await cart.save();
      }

      updateQuantity = async (cid, pid, newQuantity) => {
        let cart = await cartsModel.findById(cid)
        let product = cart.products.find((product) => {
            return product.product.toString() === pid
        })
        if (product) {
            product.quantity = newQuantity;
            return await cart.save();
        } else {
           return(error)
        }

        
    }
      
}