const mongoose = require ('mongoose');
const BlogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    body:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'public',
        enum:['public','private']        
    },
    thumbnail:{
        type:String,
        
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',//Blogs
    },
    // image:{
    //     type:String,
    // },
    createdAt:{
        type: Date,
        default:Date.now
    }
})


module.exports =  mongoose.model('Blogs', BlogsSchema)