import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Deal {
  id: string;
  customerName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  roomArea: string;
  numberOfPeople: string;
  appointmentDate: string;
  specialInstructions?: string;
  roomAccess: string;
  price: string;
  imageUrl: string;
  createdAt?: any;
}

interface DealsState {
  deals: Deal[];
}

const initialState: DealsState = {
  deals: [],
};

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    setDeals: (state, action: PayloadAction<Deal[]>) => {
      state.deals = action.payload;
    },
    addDeal: (state, action: PayloadAction<Deal>) => {
      state.deals.push(action.payload);
    },
    editDeal: (state, action: PayloadAction<Deal>) => {
      const index = state.deals.findIndex(
        (deal) => deal.id === action.payload.id
      );
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    removeDeal: (state, action: PayloadAction<string>) => {
      state.deals = state.deals.filter((deal) => deal.id !== action.payload);
    },
  },
});

export const { setDeals, addDeal, editDeal, removeDeal } = dealsSlice.actions;
export default dealsSlice.reducer;
