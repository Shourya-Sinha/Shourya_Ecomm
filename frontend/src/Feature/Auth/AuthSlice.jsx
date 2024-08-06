import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
const Base_Url = "http://localhost:7000";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  isRegistered: false,
  isTokenSent:false,
  error: null,
  token: "",
  user: null,
  accessToken: "",
  antNotification: {
    open: null,
    severity: null,
    message: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
      state.error = action.payload.error;
    },
    logIn(state, action) {
      state.isLoading = true;
      state.error = null;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logInCookie(state, action) {
      state.isLoading = true;
      state.error = null;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.refreshToken;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logOut(state) {
      state.isLoading = false;
      state.isLoggedIn = false;
      (state.token = null), (state.user = null), (state.accessToken = null);
    },
    openNotification(state, action) {
      state.antNotification.open = true;
      state.antNotification.severity = action.payload.severity;
      state.antNotification.message = action.payload.message;
    },
    loginWithCookiesPending(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginWithCookiesFulfilled(state, action) {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.token = action.payload.refreshToken;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    loginWithCookiesRejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerUserSlice(state,action){
      state.isLoading = true;
      state.isRegistered = true; // Add this line
      state.user = action.payload.user;
    },
    userForgotPassword(state,action){
      state.isLoading=true;
      state.isTokenSent=true;
    },
    resetForgotPasswordState(state) {
      state.isTokenSent = false;
    },
    resetUserPassword(state,action){
      state.isLoading=false;
    }
  },
});

//export const {logIn,logOut}=authSlice.actions;
export default authSlice.reducer;

export const resetForgotPasswordState = () => (dispatch) => {
  dispatch(authSlice.actions.resetForgotPasswordState());
};

export const LoginUser = (formValues) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${Base_Url}/auth/user/login`,
      formValues,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch(
      authSlice.actions.logIn({
        isLoggedIn: true,
        token: response.data.token,
        user: response.data.user,
      })
    );
    window.localStorage.setItem("uoi-did", response.data.token);
    dispatch(
      authSlice.actions.openNotification({
        severity: "success",
        message: response.data.message,
      })
    );
    dispatch(
      authSlice.actions.updateIsLoading({ isLoading: false, error: false })
    );
  } catch (error) {
    //console.log('error in auth slice',error);
    dispatch(
      authSlice.actions.openNotification({
        severity: "error",
        message: error.message,
      })
    );
    dispatch(
      authSlice.actions.updateIsLoading({ isLoading: false, error: true })
    );
  }
};

export const LoginWithCookies = () => async (dispatch) => {
  dispatch(authSlice.actions.loginWithCookiesPending());
  try {
    const response = await axios.post(
      `${Base_Url}/auth/user/token/login`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    dispatch(authSlice.actions.loginWithCookiesFulfilled(response.data));
  } catch (error) {
    dispatch(authSlice.actions.loginWithCookiesRejected(error.response.data));
  }
};

export const LogoutUser = () => async (disatch) => {
  try {
    const response = await axios.post(
      `${Base_Url}/auth/user/logout`,
      {},
      {
        headers: {
          //'Authorization': `Bearer ${window.localStorage.getItem('uoi-did')}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    disatch(
      authSlice.actions.logOut({
        isLoggedIn: false,
        token: null,
        user: null,
      })
    );
    console.log("loggout", response.data);
    window.localStorage.removeItem("uoi-did");
    window.sessionStorage.removeItem("uoi-did");
    disatch(
      authSlice.actions.openNotification({
        severity: "success",
        message: response.data.message,
      })
    );
  } catch (error) {
    disatch(
      authSlice.actions.openNotification({
        severity: "error",
        message: error.message,
      })
    );
  }
};

export const RegisterUser = (formValues)=> async (dispatch) =>{
  try {
    const response = await axios.post(`${Base_Url}/auth/user/register`,formValues,{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    dispatch(authSlice.actions.registerUserSlice({
      user: response.data.user,
    }));
    dispatch(authSlice.actions.openNotification({
      severity:'success',
      message: response.data.message
    }));
    //console.log('rersponse success in slice',response)
  } catch (error) {
    //console.log('error in register user in slice',error)
    dispatch(authSlice.actions.openNotification({severity:'error',message:error.response.data.message}));
  }
}

export const forgotPassword = (formValues)=> async (dispatch)=>{
  try {
    const reponse = await axios.post(`${Base_Url}/auth/user/forgotPassword-token`,formValues,{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    //console.log('response in forgot password in slice',reponse.data);
    dispatch(authSlice.actions.userForgotPassword());
    dispatch(authSlice.actions.openNotification({
      severity:'success',
      message: reponse.data.message
    }));
    setTimeout(() => {
      dispatch(resetForgotPasswordState());
    }, 5000);
    
  } catch (error) {
    console.log('error in forgot password user in slice',error);
    dispatch(authSlice.actions.openNotification({
      severity:'error',
      message: error.response.data.message
    }))
  }
}

export const resetPasswordUser = (formValues,authSlice)=>{
  try {
    
  } catch (error) {
    
  }
}
