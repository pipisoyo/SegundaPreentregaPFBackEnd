import mongoose, { Schema } from "mongoose"

const collection = "Messeges"

const schema = new Schema({
    
    email :{
       type:String
    },
    message :{
        type:String
    }
    
})

const messagesModel =mongoose.model(collection,schema)

export default messagesModel