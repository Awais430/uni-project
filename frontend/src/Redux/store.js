import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from "./theme/themSlice.js";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  theme: themeReducer,
});
const persisConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReducer = persistReducer(persisConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export default Store;
export const persistor = persistStore(store);
