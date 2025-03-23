import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaArrowRightLong } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { RiHandbagLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import CustomerForm from "../customer/CustomerForm";
import DealForm from "../deals/DealsForm";
function AddNewButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-[#514EF3] rounded-4xl lg:w-[130px] h-[50px] hover:bg-[#29286a] text-white hover:text-white"
          variant="outline"
        >
          Add New
          <span>
            <img src="/images/Icon.svg" alt="" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[240px] min-h-[153px]">
        <DialogHeader>
          <DialogTitle>Add New</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <RiHandbagLine className="w-[25px] h-[25px] text-[#7E92A2]" />
              <Label
                htmlFor="name"
                className="text-[14px] font-medium text-primary"
              >
                Deal
              </Label>
            </div>
            <DealForm
              children={
                <FaArrowRightLong className="text-[#514EF3] w-5 h-[15px] cursor-pointer" />
              }
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <FiUsers className="w-[25px] h-[25px] text-[#7E92A2]" />
              <Label
                htmlFor="name"
                className="text-[14px] font-medium text-primary"
              >
                Customer
              </Label>
            </div>
            <CustomerForm
              children={
                <FaArrowRightLong className="text-[#514EF3] w-5 h-[15px] cursor-pointer" />
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewButton;
