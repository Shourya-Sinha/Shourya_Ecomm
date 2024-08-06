import mongoose from "mongoose";

const validateMonoDbid = (id) =>{
    //const isValid = mongoose.Types.isValid(id);
    // const isValid = mongoose.Types.ObjectId.isValid(id);
    // if(!isValid){
    //     throw new Error("Invalid Mongoose ID or Manipulate Id");
    // }
    console.log('validate function id',id);
    const isVilidity = mongoose.Types.ObjectId.isValid(id);
    if(!isVilidity){
        throw new Error("Invalid Mongoose ID or Manipulated ID");
    }
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     console.log('validate function id',id);
    //     throw new Error('Invalid Mongoose ID or Manipulated ID');
    // }
}

export default validateMonoDbid;