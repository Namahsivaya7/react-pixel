import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } =
  customerSlice.actions;
export default customerSlice.reducer;
