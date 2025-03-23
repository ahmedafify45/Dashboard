import { Routes, Route, useLocation } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Sidebar from "./components/sidebar/SideBar";
import Navbar from "./components/header/Navbar";
import CustomerPage from "./pages/CustomerPage";
import DealList from "./components/deals/DealsList";
import AddNewButton from "./components/header/add-new-button";
import DealForm from "./components/deals/DealsForm";
import { Button } from "./components/ui/button";
import CustomerForm from "./components/customer/CustomerForm";
import TaskPage from "./pages/TaskPage";
import { TasksForm } from "./components/task/TaskForm";
import { JSX } from "react/jsx-runtime";
import DemoVersionMessage from "./components/sorry/DemoVersion";
import { Toaster } from "sonner";

const App = () => {
  const location = useLocation(); // استخدم useLocation لجلب المسار الحالي

  // خريطة العناوين بناءً على المسار الحالي
  const titlesMap: { [key: string]: string } = {
    "/": "Dashboard",
    "/deals": "Deals",
    "/customer": "Customers",
    "/tasks": "Tasks",
    "/calendar": "Calendar",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  // خريطة الأزرار بناءً على المسار الحالي
  const buttonsMap: { [key: string]: JSX.Element | null } = {
    "/": <AddNewButton />, // زر الإضافة في الصفحة الرئيسية
    "/deals": (
      <Button
        className="bg-[#514EF3] rounded-4xl w-[150px] h-[50px] hover:bg-[#29286a] text-white hover:text-white"
        variant="outline"
      >
        <DealForm children={"Add Deal"} />
        <span>
          <img src="/images/Icon.svg" alt="" />
        </span>
      </Button>
    ),
    "/customer": (
      <Button
        className="bg-[#514EF3] rounded-4xl w-[150px] h-[50px] hover:bg-[#29286a] text-white hover:text-white"
        variant="outline"
      >
        <CustomerForm children={"Add Customer"} />
        <span>
          <img src="/images/Icon.svg" alt="" />
        </span>
      </Button>
    ),
    "/tasks": (
      <Button
        className="bg-[#514EF3] rounded-4xl w-[150px] h-[50px] hover:bg-[#29286a] text-white hover:text-white"
        variant="outline"
      >
        <TasksForm children={"Add Task"} />
        <span>
          <img src="/images/Icon.svg" alt="" />
        </span>
      </Button>
    ),
    // "/calendar": null, // لا يوجد زر في التقويم
    // "/analytics": null, // لا يوجد زر في التحليلات
    // "/settings": null, // لا يوجد زر في الإعدادات
  };

  // تحديد العنوان والزر بناءً على المسار الحالي
  const pageTitle = titlesMap[location.pathname] || "Dashboard";
  const pageButton = buttonsMap[location.pathname] || null;

  return (
    <div className="h-screen flex flex-col">
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: "black",
            color: "white",
            border: "1px solid #4b5563", // لون الحدود (رمادي داكن)
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // ظل خفيف
          },
        }}
      />
      <Navbar title={pageTitle} button={pageButton} />

      {/* Main Content يحتوي على Sidebar والمحتوى الرئيسي */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/deals" element={<DealList />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="*" element={<DemoVersionMessage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
