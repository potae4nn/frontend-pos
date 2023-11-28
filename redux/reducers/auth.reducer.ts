const initialState = {
  token: null,
  user: null,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        token: payload.token,
        user: { username: payload.user.username },
      };
    case "CLEAR":
      return {
        ...state,
        token: '',
        user: null,
      };
      // === initialState  ก็ได้

    default:
      return state;
  }
};
