import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId, ref:'Brand',
        required:true,
    },
    images:[{
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }],
    color:[
        {
            type:mongoose.Schema.Types.ObjectId,ref:'Color',
        }
    ],
    tags:{
        type: String,
        default: ["Normal"],
        enum: ["Featured","Hot","Trending","Normal"],
    },
    sold:{
        type:Number,
        default:0
    },
    totalRatings:{
        type:Number,
        default:0
    },
    ratings:[{
        name:String,
        email:String,
        star:Number,
        revTitle:String,
        comment:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId, ref:'UserModel'},
    }],
},{timestamps:true});

//Export the model
const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;