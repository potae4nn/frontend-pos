import { combineReducers } from "redux";
import authenReducer from "./auth.reducer";
import productReducer from "./product.reducer";

const rootReducer = combineReducers({
    authenReducer,
    productReducer
})

export default rootReducer;