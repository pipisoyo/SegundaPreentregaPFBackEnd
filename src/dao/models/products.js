import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose;
const collection = "products"

const schema = new mongoose.Schema({

    title :{
        type:String,
        require:true
    },
    description :{
        type:String,
        require:true
    },
    price :{
        type:Number,
        require:true
    },
    code :{
        type:String,
        require:true
    }, 
    stock :{
        type:Number,
        require:true
    }, 
    status :{
        type:Boolean,
        require:true
    },
    category :{
        type:String,
        require:true
    },
    thumbnails :{
        type:[String],
        require:true
    }
})

schema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collection, schema);

export default productsModel