import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var blogCatSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
},{
    timestamps: true,
});

//Export the model
const BlogCat = mongoose.model('BlogCategory', blogCatSchema);
export default BlogCat;