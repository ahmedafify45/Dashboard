import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

// واجهة تعريف بيانات المهمة
interface Task {
  id: string;
  description: string;
  dueDate: string; // سيتم تخزينه كـ `ISO string`
  completed: boolean;
}

// الحالة الابتدائية
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// ✅ جلب المهام من Firebase مع تحويل `Timestamp` إلى `ISO string`
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      description: data.description,
      dueDate: data.dueDate?.toDate().toISOString(), // ✅ تحويل `Timestamp` إلى `string`
      completed: data.completed,
    };
  }) as Task[];
});

// ✅ إضافة مهمة جديدة وتحويل `dueDate` إلى `Timestamp`
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: Omit<Task, "id">) => {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      dueDate: Timestamp.fromDate(new Date(task.dueDate)), // ✅ تحويل `ISO string` إلى `Timestamp`
    });
    return { id: docRef.id, ...task };
  }
);

// ✅ تحديث مهمة وتحويل `dueDate` إلى `Timestamp`
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      description: task.description,
      dueDate: Timestamp.fromDate(new Date(task.dueDate)), // ✅ تحويل `ISO string` إلى `Timestamp`
      completed: task.completed,
    });
    return task;
  }
);

// ✅ حذف مهمة من Firebase و Redux
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef); // حذف من Firebase
    return taskId; // إرجاع الـ id لحذفه من Redux
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
