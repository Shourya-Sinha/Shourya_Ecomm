import { configureStore } from "@reduxjs/toolkit";
import {persistStore,persistReducer} from 'redux-persist';
import {useDispatch as useAppDispatch, useSelector as useAppSelector} from 'react-redux';
import { rootPersistConfig,rootReducer } from "../Feature/Auth/RootReducer";

const persistedReducer = persistReducer(rootPersistConfig,rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
            immutableCheck:false
        }),
});

const persistor= persistStore(store);
const useSelector = useAppSelector;
const useDispatch=()=>useAppDispatch();

export {store, persistor, useSelector, useDispatch};