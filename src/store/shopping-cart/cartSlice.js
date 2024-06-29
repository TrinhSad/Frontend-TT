import { createSlice } from "@reduxjs/toolkit";
const setSessionStorageItem = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const getSessionStorageItem = (key) => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const setItemFunc = (item, totalAmount, totalQuantity) => {
  setSessionStorageItem("cartItems", item);
  setSessionStorageItem("totalAmount", totalAmount);
  setSessionStorageItem("totalQuantity", totalQuantity);
};

const initialState = {
  cartItems: getSessionStorageItem("cartItems") || [],
  totalQuantity: getSessionStorageItem("totalQuantity") || 0,
  totalAmount: getSessionStorageItem("totalAmount") || 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const _id = action.payload._id;
      const extraIngredients = action.payload.extraIngredients;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (!existingItem) {
        state.cartItems.push({
          _id: _id,
          productName: newItem.productName,
          imagePath: newItem.imagePath,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          extraIngredients: newItem.extraIngredients,
        });
        state.totalQuantity++;
      } else if (
        existingItem &&
        JSON.stringify(existingItem.extraIngredients) ===
          JSON.stringify(extraIngredients)
      ) {
        state.totalQuantity++;
        existingItem.quantity++;
      } else {
        const index = state.cartItems.findIndex(
          (s) => s._id === existingItem._id
        );
        const newValue = {
          _id: existingItem._id,
          productName: existingItem.productName,
          imagePath: existingItem.imagePath,
          price: existingItem.price,
          quantity: 1,
          totalPrice: existingItem.price,
          extraIngredients: extraIngredients,
        };
        state.cartItems.splice(index, 1, newValue);
        state.totalQuantity = state.cartItems.reduce(
          (total, item) => total + Number(item.quantity),
          0
        );
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

    removeItem(state, action) {
      const _id = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item._id !== _id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) - Number(existingItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

    deleteItem(state, action) {
      const _id = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item._id !== _id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
