import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const user_Url = "http://localhost:7000";

const initialState = {
  isLoading: false,
  error: null,
  address: null,
  antNotification: {
    open: null,
    severity: null,
    message: null,
  },
  allAddress:[],
};

const userInfoSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
      state.error = action.payload.error;
    },
    setAddress(state,action){
        state.isLoading = false;
        state.address = action.payload.address;
        state.error = null;
    },
    setError(state, action) {
        state.isLoading = false;
        state.error = action.payload.error;
    },
    getAllUserAddress(state,action){
        state.isLoading = false;
        state.allAddress = action.payload.allAddress;
        state.error = null;
    },
    deleteUserAddress(state,action){
        state.isLoading = false;
        state.allAddress = state.allAddress.filter(address=>address._id!==action.payload.addressId);
        state.error = null;
    },
    updateUserAddress(state,action){
        state.isLoading = false;
        //state.allAddress = state.allAddress.map(br=> br._id === action.payload.id? action.payload :br );
        state.allAddress = state.allAddress.map(address => 
            address._id === action.payload.addressId ? { ...address, ...action.payload.addressData } : address 
        );
        state.error = null;
    },
    updateStatus(state, action) {
        state.isLoading = false;
        // Set all addresses as non-default
        state.allAddress.forEach((address) => {
          if (address._id === action.payload.addressId) {
            address.isDefault = true;
          } else {
            address.isDefault = false;
          }
        });
        state.error = null;
      },
    openNotification(state, action) {
        state.antNotification.open = true;
        state.antNotification.severity = action.payload.severity;
        state.antNotification.message = action.payload.message;
      },
  },
});

export default userInfoSlice.reducer;

export const changeDefaultAddress = (addressId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('uoi-did');
        if (!token) {
            throw new Error("Please Login First");
        }
        const response = await axios.put(`${user_Url}/address/user/update-status/${addressId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Update response:', response.data);
        dispatch(userInfoSlice.actions.updateStatus({
            addressId,
            addressData: response.data.data
        }));
        dispatch(userInfoSlice.actions.openNotification({
            severity: "success",
            message: response.data.message,
        }));
    } catch (error) {
        console.log('Error on slice update:', error);
        dispatch(userInfoSlice.actions.setError({ error: error.message }));
        dispatch(userInfoSlice.actions.openNotification({
            severity: "error",
            message: error.message,
        }));
    }
};


// export const chnageDegalutAddress =(addressId)=>async (dispatch)=>{
//     try {
//         const token = localStorage.getItem('uoi-did');
//         if (!token) {
//             throw new Error("Please Login First");
//         }
//         const response = await axios.put(`${user_Url}/address/user/update-status/${addressId}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log('Update response:', response.data);
//         dispatch(userInfoSlice.actions.updateUserAddress({addressId}));
//         dispatch(userInfoSlice.actions.openNotification({
//             severity: "success",
//             message: response.data.message,
//         }));
//     } catch (error) {
//         console.log('Error on slice updation:', error);
//         dispatch(userInfoSlice.actions.setError({ error: error.message }));
//         dispatch(userInfoSlice.actions.openNotification({
//             severity: "error",
//             message: error.message,
//         }));
//     }
// }

export const updateUserAddress = (addressId, addressData) => async (dispatch) => {
    dispatch(userInfoSlice.actions.updateIsLoading({ isLoading: true }));
    try {
        const token = localStorage.getItem("uoi-did");
        if (!token) {
            throw new Error("Please Login First");
        }

        const response = await axios.put(`${user_Url}/address/user/update-address/${addressId}`, { addressData }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //console.log('Update response:', response.data);

        dispatch(userInfoSlice.actions.updateUserAddress({ addressId, addressData }));
        dispatch(userInfoSlice.actions.openNotification({
            severity: "success",
            message: response.data.message,
        }));
    } catch (error) {
        //console.log('Error on slice updation:', error);
        dispatch(userInfoSlice.actions.setError({ error: error.message }));
        dispatch(userInfoSlice.actions.openNotification({
            severity: "error",
            message: error.message,
        }));
    }
};

export const deleteAddressUser = (addressId) => async (dispatch) => {
    dispatch(userInfoSlice.actions.updateIsLoading({ isLoading: true }));
    try {
        const token = localStorage.getItem("uoi-did");
        if (!token) {
            throw new Error("Please Login First");
        }
        
        const response = await axios.delete(`${user_Url}/address/user/delete-address/${addressId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        dispatch(userInfoSlice.actions.deleteUserAddress({ addressId }));
        //console.log('response in slice ', response);
        dispatch(
            userInfoSlice.actions.openNotification({
              severity: "success",
              message: response.data.message,
            })
          );
        return addressId;
    } catch (error) {
        dispatch(userInfoSlice.actions.setError({ error: error.message }));
        dispatch(
            userInfoSlice.actions.openNotification({
              severity: "error",
              message: error.message,
            })
          );
    }
};

export const getUserAddress=()=>async(dispatch)=>{
    dispatch(userInfoSlice.actions.updateIsLoading({ isLoading: true }));
    try {
        const token = localStorage.getItem("uoi-did");
        if (!token) {
            throw new Error("Please Login First ");
          }
          const response = await axios.get(`${user_Url}/address/user/getall-address`,{
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        dispatch(userInfoSlice.actions.getAllUserAddress({allAddress:response.data.data}));
    } catch (error) {
        dispatch(
            userInfoSlice.actions.setError({
              error: error.message,
            })
          );
    }
}

export const addUserAddress=(addressData)=>async(dispatch)=>{
    dispatch(userInfoSlice.actions.updateIsLoading({ isLoading: true }));
    try {
        const token = localStorage.getItem("uoi-did");
        if (!token) {
            throw new Error("Please Login First ");
          }
          
        const response = await axios.post(`${user_Url}/address/user/add-address`,addressData,{
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        dispatch(
            userInfoSlice.actions.setAddress({
              address: response.data.data,
              isLoading: false,
            })
          );
          dispatch(
            userInfoSlice.actions.openNotification({
              severity: "success",
              message: response.data.message,
            })
          );
        //console.log('response add address in slise',response.data.data);
    } catch (error) {
        //console.log('error ina dd address slice',error);
        dispatch(
            userInfoSlice.actions.setError({
              error: error.message,
            })
          );
          dispatch(
            userInfoSlice.actions.openNotification({
              severity: "error",
              message: error.message,
            })
          );
    }
}
