import { useEffect, useState } from "react";
import { FaUserFriends, FaHandshake } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Inprogress from "./Inprogress";

function DealsandCustomerCount() {
  const [customersCount, setCustomersCount] = useState(0);
  const [dealsCount, setDealsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // 🔹 جلب عدد العملاء
        const customersSnapshot = await getDocs(collection(db, "customers"));
        setCustomersCount(customersSnapshot.size); // 🔥 `size` يرجع العدد مباشرةً

        // 🔹 جلب عدد الصفقات
        const dealsSnapshot = await getDocs(collection(db, "deals"));
        setDealsCount(dealsSnapshot.size);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section>
      <div className="flex gap-10 flex-col lg:flex-row">
        <div>
          {/* ✅ بطاقة العملاء */}
          <div className="bg-white lg:w-[268px] h-[168px] flex justify-between px-4 items-center rounded-2xl">
            <div className="flex flex-col">
              <p className="text-[18px] font-semibold text-[#7E92A2]">
                Customers
              </p>
              <p className="text-[48px] text-primary font-semibold">
                {customersCount}
              </p>
            </div>
            <div
              className={`w-[80px] h-[80px] rounded-full flex justify-center items-center ${
                customersCount === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-[#6ac4b280] text-[#2DC8A8]"
              }`}
            >
              <FaUserFriends className="text-2xl" />
            </div>
          </div>

          {/* ✅ بطاقة الصفقات (Deals) */}
          <div className="bg-white lg:w-[268px] h-[168px] flex justify-between px-4 items-center rounded-2xl mt-4">
            <div className="flex flex-col">
              <p className="text-[18px] font-semibold text-[#7E92A2]">Deals</p>
              <p className="text-[48px] text-primary font-semibold">
                {dealsCount}
              </p>
            </div>
            <div
              className={`w-[80px] h-[80px] rounded-full flex justify-center items-center ${
                dealsCount === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-[#FE808480] text-[#FE8084]"
              }`}
            >
              <FaHandshake className="text-2xl" />
            </div>
          </div>
        </div>
        <Inprogress status="IN PROGRESS" />
      </div>
    </section>
  );
}

export default DealsandCustomerCount;
