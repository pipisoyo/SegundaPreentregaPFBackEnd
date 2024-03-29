import productsModel from "../models/products.js";


export default class productsManager{

    getAll = async (limit) => {
        let result = await productsModel.find().limit(limit).lean();
        return result;

    }
    getById = async(id) =>{

        let result = await productsModel.findById(id);
        return result;
    }

    addProduct = async(newProduct) =>{

        let result = await productsModel.create(newProduct);
        return result;
    }

    addProducts =async(products)=>{

        let result = await productsModel.insertMany(products);
        return result;
    }

    updateProduct = async(id, productData) =>{

        let result = await productsModel.updateOne({_id:id},productData);
        return result;
    }
    delateProduct = async(id) =>{

        let result = await productsModel.deleteOne({_id:id});
        return result;
    }

}

