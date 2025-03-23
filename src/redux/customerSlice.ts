/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/config/firebaseConfig";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// 🟢 **تعريف نوع بيانات العميل**
interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl?: string; // الصورة اختيارية
}

// 🟢 **تعريف حالة Redux**
interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

// ✅ **الحالة الابتدائية**
const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

// 🚀 **Thunks للتعامل مع Firestore**

// 🟢 **1️⃣ جلب جميع العملاء**
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[];
      return customers;
    } catch (error) {
      return rejectWithValue("Failed to fetch customers");
    }
  }
);

// 🟢 **2️⃣ إضافة عميل جديد**
export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customer: Customer, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "customers"), customer);
      return { id: docRef.id, ...customer };
    } catch (error) {
      return rejectWithValue("Failed to add customer");
    }
  }
);

// 🟢 **3️⃣ تحديث بيانات العميل**
export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (
    { id, updatedData }: { id: string; updatedData: Partial<Customer> },
    { rejectWithValue }
  ) => {
    try {
      const customerRef = doc(db, "customers", id);
      await updateDoc(customerRef, updatedData);
      return { id, ...updatedData } as Customer;
    } catch (error) {
      return rejectWithValue("Failed to update customer");
    }
  }
);

// 🟢 **4️⃣ حذف عميل**
export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete customer");
    }
  }
);

// ✅ **إنشاء Slice**
const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟢 **جلب العملاء**
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomers.fulfilled,
        (state, action: PayloadAction<Customer[]>) => {
          state.loading = false;
          state.customers = action.payload;
        }
      )
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟢 **إضافة عميل**
      .addCase(
        addCustomer.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.customers.push(action.payload);
        }
      )

      // 🟢 **تحديث عميل**
      .addCase(
        updateCustomer.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.customers = state.customers.map((customer) =>
            customer.id === action.payload.id
              ? { ...customer, ...action.payload }
              : customer
          );
        }
      )

      // 🟢 **حذف عميل**
      .addCase(
        deleteCustomer.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.customers = state.customers.filter(
            (customer) => customer.id !== action.payload
          );
        }
      );
  },
});

export default customerSlice.reducer;
