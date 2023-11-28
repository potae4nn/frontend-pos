import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { MakeStore, createWrapper, Context } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// NOTE: config store
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const persistConfig = {
  key: "cart",
  storage,
};
// combine persistReducer
const persistedReducer = persistReducer(persistConfig, reducer);

// devtool for google chome
const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// createStore persistedReducer
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);
//  make persistStore for store
const persistor = persistStore(store);

// create a makeStore function
const makeStore: MakeStore<any> = (context: Context) => store;

// export an assembled wrapper
const wrapper = createWrapper<any>(makeStore, { debug: true });

export { store, persistor, wrapper };


// const makeStore: MakeStore<any> = (context: Context) =>
//   createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));