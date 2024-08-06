import asyncHandler from 'express-async-handler';
import Address from '../Models/AddressModel.js';
import User from '../Models/UserModel.js';
import mongoose from 'mongoose';

    //Add a new Address
const addAddress = asyncHandler(async (req,res)=>{
        try {
            const addressData = req.body;
            const { id } = req.user;
        
            const user = await User.findById(id);
            if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
            }
        
            // If the new address is set as default, unset the default for all other addresses
            if (addressData.isDefault) {
            await Address.updateMany({ user: user._id, isDefault: true }, { isDefault: false });
            }
        
            const address = new Address({ ...addressData, user: user._id });
            await address.save();
        
            return res.status(200).json({
            status: 'success',
            message: 'Address added successfully',
            data: address,
            });
        } catch (error) {
            return res.status(500).json({
                status:'error',
                message: error.message ,
            })
        }
    });

//Update Address

const updateAddress = asyncHandler(async (req, res) => {
    try {
        const { addressData } = req.body;
        const { id } = req.user;
        const { addressId } = req.params;

        //console.log('Updating address:', addressData);  // Check if this logs correct data

        if (!addressData) {
            return res.status(400).json({
                status: 'error',
                message: 'Address data is required',
            });
        }

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if the address exists
        const address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found',
            });
        }

        // Update the address
        const newAddress = await Address.findByIdAndUpdate(addressId, addressData, { new: true });

        //console.log('New address after update:', newAddress);

        return res.status(200).json({
            status: 'success',
            message: 'Address updated successfully',
            data: newAddress,
        });
    } catch (error) {
        console.log('Error updating address:', error.message);
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

//Get All Address
const getAllAddress = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.user;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                status:'error',
                message: 'User not found'
            });
        }
        const address = await Address.find({user:user._id});
        return res.status(200).json({
            status:'success',
            message: 'Addresses fetched successfully',
            data: address
        });
    } catch (error) {
        return res.status(500).json({
            status:'error',
            message: error.message,
        })
    }
});

//Delete Address
const deleteAAddress = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.user;
        //const addressId = req.params;
        const addressId = req.params.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                status:'error',
                message: 'User not found'
            });
        }
        const address = await Address.findByIdAndDelete(addressId);
        if(!address){
            return res.status(404).json({
                status:'error',
                message: 'Address not found'
            });
        }
        return res.status(200).json({
            status:'success',
            message: 'Address deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status:'error',
            message: error.message,
        })
    }
});

// chaging default address 
// const changeDefaultState = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.user; // User ID
//         const { addressId } = req.params; // Address ID

//         // Find the user
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'User not found',
//             });
//         }

//         // Check if the address exists
//         const addressToUpdate = await Address.findById(addressId);
//         if (!addressToUpdate) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Address not found',
//             });
//         }

//         // If the new address is being set as default, unset the default status for all other addresses
//         if (addressToUpdate.isDefault) {
//             // Unset default status for all other addresses
//             await Address.updateMany(
//                 { user: user._id, _id: { $ne: addressId }, isDefault: true },
//                 { $set: { isDefault: false } }
//             );
//         } else {
//             // If not setting the new address as default, make sure to set it as default
//             await Address.findByIdAndUpdate(
//                 addressId,
//                 { isDefault: true },
//                 { new: true }
//             );
//         }

//         // Set the target address as default
//         const updatedAddress = await Address.findByIdAndUpdate(
//             addressId,
//             { isDefault: true },
//             { new: true }
//         );

//         return res.status(200).json({
//             status: 'success',
//             message: 'Default address updated successfully',
//             data: updatedAddress,
//         });
//     } catch (error) {
//         console.error('Error updating address:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: error.message,
//         });
//     }
// });

const changeDefaultState = asyncHandler(async (req, res) => {
    try {
        const { id } = req.user; // User ID
        const { addressId } = req.params; // Address ID to be set as default

        // Find the user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if the address exists
        const addressToUpdate = await Address.findById(addressId);
        if (!addressToUpdate) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found',
            });
        }

        // Check if any address is currently default for the user
        const currentDefaultAddress = await Address.findOne({
            user: user._id,
            isDefault: true,
            _id: { $ne: addressId } // Exclude the address to be updated
        });

        if (currentDefaultAddress) {
            // Unset the default status for the current default address
            await Address.updateMany(
                { user: user._id, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        // Set the target address as default
        const newAddress = await Address.findByIdAndUpdate(
            addressId,
            { isDefault: true },
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            message: 'This Address set to Default successfully',
            data: newAddress,
        });
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

export {addAddress,deleteAAddress,updateAddress,getAllAddress,changeDefaultState};