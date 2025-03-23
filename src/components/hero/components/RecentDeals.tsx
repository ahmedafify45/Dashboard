import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

function RecentDeals({ latestDeals, loading }: any) {
  return (
    <div>
      <div className="bg-white min-w-[200px] min-h-[51px] lg:min-w-[519px] w-full lg:max-w-[519px] rounded-[12px] border border-accent p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary mb-3">Recent Deals</h3>
          <Link to="/deals" className="text-sm text-[#514EF3]">
            View All
          </Link>
        </div>

        {loading ? (
          <Skeleton className="w-full h-10 mb-2" />
        ) : latestDeals.length === 0 ? (
          <p className="text-[#7E92A2] text-center mt-2">No Deals Found</p>
        ) : (
          <ul className="space-y-2">
            {latestDeals.map((deal: any) => (
              <li
                key={deal.id}
                className="p-2 border-b flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/images/Avatar.svg"
                    alt=""
                    className="rounded-full"
                  />
                  <span className="text-primary font-medium hidden lg:block">
                    {deal.customerName}, {deal.city}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-primary text-sm font-bold">
                    ${deal.price}
                  </span>
                  <span className="text-gray-500 text-xs hidden lg:block">
                    {new Date(
                      deal.createdAt?.seconds * 1000
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(
                      deal.createdAt?.seconds * 1000
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default RecentDeals;
