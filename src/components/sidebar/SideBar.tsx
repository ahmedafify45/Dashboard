import { Link, useLocation } from "react-router-dom";
import {
  FaTh,
  FaShoppingBag,
  FaUserFriends,
  FaList,
  FaCalendar,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation(); // استخدم useLocation للحصول على المسار الحالي

  const menuItems = [
    { path: "/", icon: <FaTh />, tooltip: "Dashboard" },
    { path: "/deals", icon: <FaShoppingBag />, tooltip: "Deals" },
    { path: "/customer", icon: <FaUserFriends />, tooltip: "Customer" },
    { path: "/tasks", icon: <FaList />, tooltip: "Tasks" },
    { path: "/calendar", icon: <FaCalendar />, tooltip: "Calendar" },
    { path: "/analytics", icon: <FaChartLine />, tooltip: "Analytics" },
    { path: "/settings", icon: <FaCog />, tooltip: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:relative lg:h-screen lg:w-[90px] bg-gray-100 flex lg:flex-col flex-row items-center justify-around lg:justify-start lg:py-4 lg:space-y-6 space-x-4 lg:space-x-0 shadow-lg z-50">
      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
            location.pathname === item.path
              ? "bg-[#514EF3] text-white shadow-lg"
              : "text-gray-500 hover:bg-gray-200 bg-white"
          }`}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
