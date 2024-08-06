import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BlogCategory',
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisLiked:{
        type:Boolean,
        default:false,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
    }],
    disLikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'UserModel',
        }
    ],
    images:[{
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }],
    author:{
        type:String,
        default:"Admin",
    },
},{
    toJSON:{
        virtuals:true,
    },toObject:{
        virtuals:true,
    },
    timestamps:true,
});

//Export the model
const Blog = mongoose.model('Blog',blogSchema);
export default Blog;