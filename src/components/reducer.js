export const reducer = (state, action) => {
  if (action.type === "LOGIN") {
    return {
      ...state,
      user: action.payload,
      isModalOpen: true,
      modalContent: `Benvenuto ${action.payload.username}!`,
      isAuthenticated: true,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      isAuthenticated: false,
      modalContent: "Bye!",
    };
  }
  if (action.type === "NO_VALUE") {
    return {
      ...state,
      isModalOpen: true,
      modalContent: "please enter email and password",
    };
  }
  if (action.type === "CLOSE_MODAL") {
    return { ...state, isModalOpen: false };
  }
  if (action.type === "ERROR") {
    return { ...state, isModalOpen: true, modalContent: action.payload };
  }
  throw new Error("no matching action type");
};
