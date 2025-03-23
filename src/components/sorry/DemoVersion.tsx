import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui for the button
import { Link } from "react-router-dom";

function DemoVersionMessage() {
  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center p-4 z-50 pointer-events-none">
      <div className="bg-white rounded-[12px] p-[40px] max-w-[540px] w-full text-center shadow-lg space-y-10 pointer-events-auto">
        {/* الأيقونة */}
        <div className="flex justify-center">
          <img className="w-20 h-20" src="/images/demo.svg" alt="Demo" />
        </div>

        {/* العنوان */}
        <h2 className="text-lg text-gray-500 font-semibold">
          DEMO VERSION ONLY
        </h2>

        {/* الرسالة */}
        <h3 className="text-2xl font-bold text-gray-900">Sorry.</h3>
        <p className="text-gray-600 leading-relaxed">
          This is an example demo only - not all screens or features are
          implemented.
        </p>

        {/* زر الإغلاق */}
        <div className="flex justify-center">
          <Link to="/">
            <Button className="bg-[#635DFF] hover:bg-[#524BCF] text-white w-full py-3 rounded-full text-lg">
              Close
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DemoVersionMessage;
