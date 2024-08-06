import { Base } from "@ant-design/charts";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Pro_Url = "http://localhost:7000/product";
export const Base_Url2 = "http://localhost:7000";
const initialState={
    products:[],
    isLoading:false,
    error:null,
    isFound:false,
    proId:null,
    cartData: { products: [] },
    coupon: { // Ensure this exists in the initial state
      totalAfterDiscount: 0,
      discountAmount: 0,
    },
    shippingFee:0,
    antNotification: {
      open: null,
      severity: null,
      message: null,
    },
    wishListItem:[],
  compareMultiProduct: [],
  orderUserHistory: [],
  categoryTotals: {},
  AllBlogs:[],
}

const productSlice = createSlice({
    name:'products',
    initialState,
    reducers:{
      resetCart: (state) => {
        state.cartData = { products: [] };
        state.coupon = {
          totalAfterDiscount: 0,
          discountAmount: 0,
        };
        state.shippingFee = 0;
      },
        updateIsLoading(state, action) {
            state.isLoading = action.payload.isLoading;
            state.error = action.payload.error;
          },
        getAllPro(state,action){
            state.isLoading=true,
            state.products = action.payload.products;
            state.error=null
        },
        setError(state, action) {
            state.isLoading = false;
            state.error = action.payload.error;
          },
          getproById(state,action){
            state.isLoading=true;
            state.isFound=true;
            state.proId = action.payload.product;
          },
          setError2(state, action) {
            state.isLoading = false;
            state.error = action.payload.error;
          },
          fetchCartData(state, action) {
            state.isLoading = false; // Set loading to false after fetching
            state.cartData = action.payload.cart;
            state.coupon.totalAfterDiscount = action.payload.cart.totalAfterDiscount || 0;
            state.coupon.discountAmount = action.payload.cart.discountAmount || 0;
            state.error = null;
        },
        setError3(state, action) {
            state.isLoading = false;
            state.error = action.payload.error;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        deletecartData(state,action){
            state.cartData.products = state.cartData.products.filter(
                (item) => item._id !== action.payload
              );
            state.isLoading = false;
            state.error = null;
        },
        updateCouponInfo(state, action) {
          state.coupon.totalAfterDiscount = action.payload.totalAfterDiscount || 0;
          state.coupon.discountAmount = action.payload.discountAmount || 0;
          //state.cartData = action.payload.cart || { products: [] };
        },
        giveShippingFee(state, action) {
          state.cartData.shippingFee = action.payload;
        },
        createFinalOrder(state,action){
          state.isLoading = false;
          state.error = null;
        },
        openNotification(state, action) {
          state.antNotification.open = true;
          state.antNotification.severity = action.payload.severity;
          state.antNotification.message = action.payload.message;
        },
        closeNotification(state) {
          state.antNotification.open = false;
          state.antNotification.severity = null;
          state.antNotification.message = null;
        },
        getWishlistItem(state,action){
          state.isLoading = true;
          state.wishListItem = action.payload.wishlist;
        },
        deleteWishItem(state, action) {
          state.wishListItem = state.wishListItem.filter(
            (item) => item._id !== action.payload
          );
        },
        compareProduct(state, action) {
          state.isLoading = true;
          // Add product to compareMultiProduct if not already present
          const productId = action.payload._id;
          const productExists = state.compareMultiProduct.some(product => product._id === productId);
    
          if (!productExists) {
            state.compareMultiProduct.push(action.payload);
          }
          state.isLoading = false;
        },
        // Optional: Add a reducer to remove a product from the comparison
        removeFromCompare(state, action) {
          state.compareMultiProduct = state.compareMultiProduct.filter(product => product._id !== action.payload);
        },
        orderHistory(state, action) {
          state.isLoading = true;
          state.orderUserHistory = action.payload.orders; // Fixed typo here
          state.categoryTotals = action.payload.categoryTotals;
        },
        getBlogs: (state, action) => {
          state.AllBlogs = action.payload.blogs;
        }
    }
});

export default productSlice.reducer;
export const { compareProduct, removeFromCompare } = productSlice.actions;

export const getAllBlogs=()=>async(dispatch)=>{
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.get(`${Base_Url2}/blog/getallBlog`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    //console.log('reponse blog in slice',response.data);
    dispatch(productSlice.actions.getBlogs({blogs:response.data.blogs}))
  } catch (error) {
    //console.log('error getting blog',error);
  }
}

export const getAllOrders=()=>async(dispatch)=>{
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.get(`${Base_Url2}/auth/user/cart/get-order`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    //console.log('response in order slice',response.data);
    dispatch(productSlice.actions.orderHistory({
      orders: response.data.orders,
      categoryTotals: response.data.categoryTotals
    }));
  } catch (error) {
    //console.log('response in order slice',error);
  }
}

export const deleteWishlistItem = (prodId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.delete(
      `${Base_Url2}/auth/user/deletewishlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { prodId }, // Pass the product ID in the request body
      }
    );
    dispatch(productSlice.actions.deleteWishItem(prodId));
    dispatch(productSlice.actions.openNotification({
      severity: "success",
      message: response.data.message,
    }));
    //console.log('response delete in slice', response);
  } catch (error) {
    dispatch(productSlice.actions.openNotification({
      severity: "error",
      message: error.message,
    }));
    //console.log('response delete in slice error', error);
  }
};

export const getUserWishlistData=()=>async (dispatch)=>{
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.get(`${Base_Url2}/auth/user/wishlist`,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    //console.log('getting wishlist data in slice',response.data);
    dispatch(productSlice.actions.getWishlistItem({wishlist:response.data.wishlist}));
  } catch (error) {
    //console.log('getting wishlist data in slice error',error);
  }
}

export const addToWishlist=(prodId)=>async(dispatch)=>{
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.put(`${Pro_Url}/addtoWuihlist`, 
      { prodId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    dispatch(productSlice.actions.openNotification({
      severity: "success",
      message: response.data.message,
    }));
    //console.log('add to wishlist slice',response.data);
  } catch (error) {
    dispatch(productSlice.actions.openNotification({
      severity: "error",
      message: error.message,
    }));
    //console.log('add to wishlist slice error',error);
  }
}

export const addtocartProduct = (id, quantity, color) => async (dispatch) => {
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.post(
      `${Base_Url2}/auth/user/cart`,
      {
        cart: [
          {
            id,
            count: quantity,
            color,
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    dispatch(productSlice.actions.openNotification({
      severity: "success",
      message: response.data.message,
    }));
    //console.log('response in slice add to cart function', response);
    dispatch(getUserCartData());
  } catch (error) {
    //console.log('error response in add to cart function', error);
    dispatch(productSlice.actions.openNotification({
      severity: "error",
      message: error.message,
    }));
  }
};

export const createFinalUserOrder = (orderData,navigate) => async (dispatch) => {
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token || token === null) {
      throw new Error("User not authenticated in create final order");
    }
    const response = await axios.post(`${Base_Url2}/auth/user/cart/create-cashorder`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      dispatch(productSlice.actions.createFinalOrder()); // Adjust according to your slice

      // Call the emptyCart API to clear the user's cart
      await axios.delete(`${Base_Url2}/auth/user/emptycart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Reset only the specific parts of the state
      dispatch(productSlice.actions.resetCart());

      //console.log('Order successfully created and cart emptied:', response.data);

      dispatch(productSlice.actions.openNotification({
        severity: "success",
        message: response.data.message,
      }));

      // Navigate to the home page after successful order
      navigate('/');
    } else {
      // Handle unexpected response statuses
      //console.error('Unexpected response status:', response.status);
      dispatch(productSlice.actions.openNotification({
        severity: "error",
        message: "Unexpected response status",
      }));
    }
  } catch (error) {
    dispatch(productSlice.actions.openNotification({
      severity: "error",
      message: error.message,
  }));
    //console.log('error in create final order', error);
  }
};

export const applyShippingFee = (shippingCost) => async (dispatch) => {
  try {
    dispatch(productSlice.actions.giveShippingFee(shippingCost));
    //console.log('Applied shipping fee in slice', shippingCost);
  } catch (error) {
    console.log('Something went wrong in slice', error);
  }
};

export const applyCoupononCart = (coupon) => async (dispatch) => {
  try {
    const token = localStorage.getItem('uoi-did');
    if (!token || token === null) {
      throw new Error("User not authenticated in delete cart single product");
    }
    const response = await axios.post(`${Base_Url2}/auth/user/cart/apply-coupon`, { coupon }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const { totalAfterDiscount, discountAmount } = response.data;
    dispatch(productSlice.actions.updateCouponInfo({ totalAfterDiscount, discountAmount }));
    //console.log('response', response.data);
  } catch (error) {
   // console.log('error in slice', error);
  }
};

export const deletecartsingleProduct = (productId) => async (dispatch) => {
    try {
      const token = localStorage.getItem('uoi-did');
  
      if (!token || token === null) {
        throw new Error("User not authenticated in delete cart single product");
      }
  
      const response = await axios.delete(`${Base_Url2}/auth/user/delete-single-pro/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      //dispatch(productSlice.actions.deletecartData(response.data.cart)); // Use the response data to update the cart
      dispatch(productSlice.actions.deletecartData(productId));
      //return productId;
      //console.log('reponse in deleting cart single product', response.data.cart);
    } catch (error) {
      //console.log('error in deleting cart single product', error);
      //dispatch(productSlice.actions.setError3({error:error.message}))
    }
  };

// export const getUserCartData=()=>async (dispatch)=>{
//   const token = localStorage.getItem('uoi-did');
//         //const token = user?.token;
//         if(!token){
//             throw new Error("User not authenticated in cart");
//         }
//     try {
        
//         const response = await axios.get(`${Base_Url2}/auth/user/getcart`,{
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                  'Content-Type': 'application/json'
//             }
//         });
//         dispatch(productSlice.actions.fetchCartData({ cart: response.data.cart }));
//         dispatch(productSlice.actions.openNotification({
//           severity: "success",
//           message: response.data.message,
//       }));
//         //console.log('getting user cart data in slice',response.data.cart);
//     } catch (error) {
//         //console.log('error in getting user cart data in slice',error);
//         //dispatch(productSlice.actions.setError(error.message));
//         dispatch(productSlice.actions.openNotification({
//           severity: "error",
//           message:  "something error " ,
//       }));
//     }
// }
export const getUserCartData = () => async (dispatch) => {
  const token = localStorage.getItem('uoi-did');
  if (!token) {
    // dispatch(productSlice.actions.setError("User not authenticated in cart"));
    // dispatch(productSlice.actions.openNotification({
    //   severity: "error",
    //   message: "User not authenticated in cart",
    // }));
    return;
  }

  try {
    const response = await axios.get(`${Base_Url2}/auth/user/getcart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      dispatch(productSlice.actions.fetchCartData({ cart: response.data.cart }));
      // dispatch(productSlice.actions.openNotification({
      //   severity: "success",
      //   message: response.data.message,
      // }));
    } else {
      throw new Error("Failed to fetch cart data");
    }
  } catch (error) {
    // Retry logic for 404 error
    if (error.response && error.response.status === 404) {
      setTimeout(async () => {
        try {
          const retryResponse = await axios.get(`${Base_Url2}/auth/user/getcart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          dispatch(productSlice.actions.fetchCartData({ cart: retryResponse.data.cart }));
          // dispatch(productSlice.actions.openNotification({
          //   severity: "success",
          //   message: retryResponse.data.message,
          // }));
        } catch (retryError) {
          // dispatch(productSlice.actions.setError(retryError.message));
          // dispatch(productSlice.actions.openNotification({
          //   severity: "error",
          //   message: "Something went wrong. Please try again.",
          // }));
        }
      }, 1000); // Retry after 1 second
    } else {
      // dispatch(productSlice.actions.setError(error.message));
      // dispatch(productSlice.actions.openNotification({
      //   severity: "error",
      //   message: "Something went wrong. Please try again.",
      // }));
    }
  }
};

export const getproductById=(id)=>async(dispatch)=>{
    try {
        const response = await axios.get(`${Pro_Url}/getaProduct/${id}`,{
            headers: {
                "Content-Type": "application/json",
              },
        });
        dispatch(productSlice.actions.getproById({ product: response.data.product }));
        //console.log('found by id in slice',response.data);
    } catch (error) {
        //console.log('error in finding product',error);
        dispatch(productSlice.actions.setError2({ error: error.message }));
    }
}

export const getProducts=()=>async(dispatch)=>{
    dispatch(productSlice.actions.updateIsLoading({ isLoading: true, error: null }));
    try {
        const response = await axios.get(`${Pro_Url}/getallProduct`,{
            headers: {
                "Content-Type": "application/json",
              },
        });
        dispatch(productSlice.actions.getAllPro({ products: response.data.products }));
       // console.log('getting all products', response.data);
        //dispatch(productSlice.actions.updateIsLoading({isLoading: false, error: null}));
    } catch (error) {
        //console.log("error in getting products", error);
        dispatch(productSlice.actions.setError({ error: error.message }));
    }
}



