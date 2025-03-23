import React from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";

interface InprogressProps {
  status: "IN PROGRESS" | "COMPLETED" | "CANCELLED";
}

const statusStyles: Record<string, { text: string; bg: string }> = {
  "IN PROGRESS": { text: "text-[#514EF3]", bg: "bg-[#ECECFE]" },
  COMPLETED: { text: "text-green-700", bg: "bg-green-100" },
  CANCELLED: { text: "text-red-700", bg: "bg-red-100" },
};

function Inprogress({ status }: InprogressProps) {
  return (
    <section>
      <div className="bg-white min-w-[300px] min-h-[51px] lg:min-w-[519px] w-full lg:max-w-[519px] rounded-[12px] border border-accent p-4 hidden lg:block">
        <div className="mx-4 my-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/Avatar.svg" alt="" className="rounded-full" />
                <div>
                  <p className="text-primary font-bold text-sm hidden lg:block">
                    1824 Turkey Pen Road
                  </p>
                  <p className="text-sm text-gray-500 hidden lg:block">
                    Cleveland,OH 12345
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Button
                  className={`${statusStyles[status]?.text} ${statusStyles[status]?.bg} rounded-full`}
                >
                  {status.toLowerCase()}
                </Button>
                <FaArrowRightLong
                  className={`${statusStyles[status]?.text} w-[15.41px]`}
                />
              </div>
            </div>
            <div className="mt-10 border-t-[1px] border-accent pt-4 flex items-center gap-5">
              <div className="bg-[#514EF3] w-5 h-5 rounded-full flex items-center justify-center">
                <div className="bg-white w-2 h-2 rounded-full"></div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">17 Nov 2021</p>
                <p className="font-medium">
                  Installation of the new air conditioning system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Inprogress);
