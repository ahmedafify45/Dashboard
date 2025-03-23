import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import RecentDeals from "./components/RecentDeals";
import DealsandCustomerCount from "./components/deals-customers";
import DealForm from "../deals/DealsForm";
import RecentCustomer from "./components/RecentCustomer";
import TaskToDo from "./components/TaskToDo";

function Hero() {
  const [latestDeals, setLatestDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDeals = async () => {
      try {
        const dealsQuery = query(
          collection(db, "deals"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(dealsQuery);
        const dealsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLatestDeals(dealsData);
      } catch (error) {
        console.error("Error fetching latest deals:", error);
      }
      setLoading(false);
    };

    fetchLatestDeals();
  }, []);

  return (
    <section className="flex flex-col lg:flex-row justify-between gap-3 p-4 lg:p-0">
      {/* الجزء الأيسر */}
      <div className="flex flex-col gap-6 w-full lg:w-2/3 mt-5 lg:ml-8">
        {/* الصف العلوي */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* البطاقة الزرقاء */}
          <div className="bg-[#514EF3] w-full lg:max-w-[268px] lg:max-h-[314px] rounded flex flex-col items-center justify-between p-6">
            <div className="flex flex-col items-center justify-center flex-grow">
              <FaCalendarAlt className="text-white w-6 h-6" />
              <p className="text-accent mt-2 text-center">
                No upcoming appointments.
              </p>
            </div>

            <DealForm>
              <Button className="w-full lg:w-[220px] h-[50px] rounded-4xl bg-white text-primary hover:bg-gray-100 cursor-pointer">
                Add Deal?
              </Button>
            </DealForm>
          </div>

          {/* أحدث الصفقات */}
          <RecentDeals latestDeals={latestDeals} loading={loading} />
        </div>

        {/* إحصائيات الصفقات والعملاء */}
        <div className="w-full">
          <DealsandCustomerCount />
        </div>
      </div>

      {/* الجزء الأيمن */}
      <div className="bg-[#EEF6FBE5] w-full lg:w-[400px] rounded-lg flex flex-col gap-5 mt-6 lg:mt-0">
        {/* العملاء الأخيرين */}
        <div className="border-b px-4 lg:px-7 py-4">
          <RecentCustomer />
        </div>

        {/* المهام */}
        <div className="flex items-center justify-center">
          <TaskToDo />
        </div>
      </div>
    </section>
  );
}

export default Hero;
