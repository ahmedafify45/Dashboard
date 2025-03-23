/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Link } from "react-router-dom";
import { LuPencil } from "react-icons/lu";

function RecentCustomer() {
  const [latestCustomers, setLatestCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestCustomers = async () => {
      try {
        const customersQuery = query(
          collection(db, "customers"),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const querySnapshot = await getDocs(customersQuery);
        const customersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLatestCustomers(customersData);
      } catch (error) {
        console.error("Error fetching latest customers:", error);
      }
      setLoading(false);
    };

    fetchLatestCustomers();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-primary mb-5">Customers</h2>
        <Link to="/customer" className="text-sm text-[#514EF3]">
          View All
        </Link>
      </div>
      <div>
        {loading ? (
          <p>Loading</p>
        ) : (
          <div className="">
            {latestCustomers.map((customer) => (
              <div
                key={customer.id}
                className="mt-10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={customer.imageUrl || "/images/Avatar.svg"}
                    alt="Avatar"
                    className="w-[44px] h-[44px] rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-primary">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <LuPencil className="text-gray-500 cursor-pointer" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(RecentCustomer);
