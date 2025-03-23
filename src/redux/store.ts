import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customerSlice";
import dealReducer from "./dealSlice";
import taskReducer from "./TaskSlice";
export const store = configureStore({
  reducer: {
    customers: customerReducer,
    deals: dealReducer,
    tasks: taskReducer,
  },
});

// تصدير أنواع Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
