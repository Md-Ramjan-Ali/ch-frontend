 





import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
 import authReducer from "../store/Slices/AuthSlice/authSlice";
import counterReducer from "../store/Slices/counterSlice/counterSlice";
import formReducer from "../store/Slices/FormSlice/FormSlice";
import { baseApi } from "@/redux/hooks/baseApi";
 
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
   auth: authReducer,
   counter: counterReducer,
  form: formReducer,
  

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware,),
});

// ✅ Enables refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;