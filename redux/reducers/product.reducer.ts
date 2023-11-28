const initialState = {
  data: [],
  cart: [],
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case "GET_PRODUCT":
      return {
        ...state,
        data: payload?.product,
      };

    case "BUY_PRODUCT":
      const { id } = payload.product;
      const productToBuy: any = state.cart.find(
        (cart: any) => cart.product.id === id
      );
      if (productToBuy) {
        return {
          ...state,
          cart: state.cart.map((carts: any) =>
            carts.product.id === id
              ? { ...carts, quantity: carts.quantity + 1 }
              : carts
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { product: payload.product, quantity: 1 }],
        };
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((carts: any) =>
          carts.product.id === payload.id
            ? { ...carts, quantity: payload.quantity }
            : carts
        ),
      };

    case "REMOVE_BUY_PRODUCT":
      return {
        ...state,
        cart: state.cart.filter(
          (cart: any) => cart.product.id !== payload.id
        ),
      };

    case "REMOVE_ALL_BUY_PRODUCT":
      return {
        ...state,
        cart: [],
      };

    case "PAYMENT":
      return {
        ...state
      };

    default:
      return state;
  }
};
