import {
  BUY_PRODUCT,
  GET_PRODUCT,
  REMOVE_BUY_PRODUCT,
  UPDATE_QUANTITY,
  REMOVE_ALL_BUY_PRODUCT,
  PAYMENT,
} from "../types";
import { Product } from "@/types/Product";
import ProductData from "@/mock/product.json";
import React from "react";

const setProductReducer = (payload: any) => ({
  type: GET_PRODUCT,
  payload,
});

const setBuyReducer = (payload: any) => ({
  type: BUY_PRODUCT,
  payload,
});

const updateQuantityReducer = (payload: any) => ({
  type: UPDATE_QUANTITY,
  payload,
});

const setRemoveReducer = (payload: any) => ({
  type: REMOVE_BUY_PRODUCT,
  payload,
});

const setRemoveAllReducer = () => ({
  type: REMOVE_ALL_BUY_PRODUCT,
});

const setPaymentReducer = () => ({
  type: PAYMENT
});

// const productData: Product[] = ProductData;

// const product = () => {
//   return (dispatch: any) => {
//     setTimeout(() => {
//       dispatch(
//         setProductReducer({
//           product: productData,
//         })
//       );
//     }, 500);
//   };
// };

const buyProduct = (product: Product) => {
  return (dispatch: any) => {
    setTimeout(() => {
      dispatch(setBuyReducer({ product }));
    }, 100);
  };
};

const updateQuantity = (id: string, quantity: number) => {
  return (dispatch: any) => {
    setTimeout(() => {
      if (quantity < 1) {
        dispatch(setRemoveReducer({ id: id }));
      } else {
        dispatch(updateQuantityReducer({ id: id, quantity: quantity }));
      }
    }, 100);
  };
};

const removeBuyProduct = (id: string) => {
  return (dispatch: any) => {
    dispatch(setRemoveReducer({ id: id }));
  };
};

const removeBuyAllProduct = () => {
  return (dispatch: any) => {
    dispatch(setRemoveAllReducer());
  };
};

const setPaymentProduct = () => {
  return (dispatch: any) => {
    dispatch(setPaymentReducer());
  };
};

export default {
  // product,
  buyProduct,
  updateQuantity,
  removeBuyProduct,
  removeBuyAllProduct,
  setPaymentProduct
};
