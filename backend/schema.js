const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        reuired:true
    },
    price:{
        type:Number,
        reuired:true
    }
})


module.exports=mongoose.model("item",userSchema)