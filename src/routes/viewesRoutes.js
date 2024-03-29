import { Router } from 'express';
import productsModel from '../dao/models/products.js';
import cartsModel from '../dao/models/carts.js';


const viewesRoutes = Router();

viewesRoutes.get('/chat', (req, res) => {
  res.render('chat');
});

viewesRoutes.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    try {
      const carts = await cartsModel.find({}).lean().exec();  
      const totalCount = await productsModel.countDocuments({});
      const totalPages = Math.ceil(totalCount / limit);
      const results = await productsModel.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();
      console.log("🚀 ~ viewesRoutes.get ~ results:", results)
  
      const prevLink = page > 1 ? `?limit=${limit}&page=${page - 1}` : null;
      const nextLink = page < totalPages ? `?limit=${limit}&page=${page + 1}` : null;
  
      res.render('products', {
        carts,
        products: results,
        prevLink,
        nextLink
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  });

  viewesRoutes.get('/cart/:cid', async(req, res) => {

    const cid = req.params.cid;
  try {
    const cart = await cartsModel.findById(cid).populate('products.product').lean().exec();
    const products = [];
    cart.products.forEach(element => { 
      let quantity = element.quantity;
      let product = element.product;
      product.quantity = quantity;
      products.push(product);
    });
    res.render('cart',{
      cart,
      cid, 
      products});
  }
  catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
})


export default viewesRoutes;