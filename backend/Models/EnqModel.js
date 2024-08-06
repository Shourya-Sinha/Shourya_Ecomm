import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var enquirySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    comment:{
        type:String,
    },
    status:{
        type:String,
        default:'Created',
        enum:['Created','Resolving','Pending','Resolved',],
    }
},{
    timestamps: true, // Saves timestamps at creation and modification of documents.
});

//Export the model
const Enquiry =  mongoose.model('Enquiry', enquirySchema);
export default Enquiry;