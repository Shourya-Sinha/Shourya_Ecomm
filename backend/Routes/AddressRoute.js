import express from 'express';

import { getUser } from '../Controllers/AuthController.js';
import { addAddress, changeDefaultState, deleteAAddress, getAllAddress, updateAddress } from '../Controllers/AddressController.js';

const router = express.Router();

router.post('/user/add-address',getUser,addAddress);
router.put('/user/update-address/:addressId',getUser,updateAddress);
router.get('/user/getall-address',getUser,getAllAddress);
router.delete('/user/delete-address/:id',getUser,deleteAAddress);
router.put('/user/update-status/:addressId',getUser,changeDefaultState);

export default router;  // Export the router for use in the main server.js file.  This is where we will define our routes for user addresses.  Note that we are using the getUser middleware to ensure that only authenticated users can access these routes.  The middleware is defined in ../Controllers/AuthController.js.  The getUser middleware checks if a user is authenticated, and if not, it sends a 401 Unauthorized response.  If the user is authenticated, it
