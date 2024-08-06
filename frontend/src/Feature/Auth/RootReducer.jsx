import { combineReducers } from "@reduxjs/toolkit"
import storage from 'redux-persist/lib/storage';
import authReducer from './AuthSlice.jsx';
import productReducer from '../Product/ProductSlice.jsx';
import userInforReducer from '../UserInfo/UserInfoSlice.jsx';

const rootReducer = combineReducers({
    auth: authReducer,
    product:productReducer,
    userInfo:userInforReducer
});

const rootPersistConfig={
    key: 'root',
    storage,
    keyPrefix:'reduc-',
    whitelist:['auth','product','userInfo'],
}

export {rootPersistConfig,rootReducer};
