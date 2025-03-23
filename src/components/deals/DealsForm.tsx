import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, storage } from "@/config/firebaseConfig";
import { toast } from "sonner";
import CustomersTable from "../customer/CustomerList";

function DealForm({ children }: any) {
  const [dealData, setDealData] = useState({
    customerName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    roomArea: "",
    numberOfPeople: "",
    appointmentDate: "",
    specialInstructions: "",
    roomAccess: "",
    price: "",
    imageUrl: "",
    status: "inprogress",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDealData({ ...dealData, [e.target.id]: e.target.value.trim() });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return "";
    setUploading(true);
    const storageRef = ref(storage, `deals/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async () => {
    console.log("Deal Data Before Submit:", dealData);

    if (
      !dealData.customerName ||
      !dealData.streetAddress ||
      !dealData.city ||
      !dealData.state ||
      !dealData.zipCode ||
      !dealData.roomArea ||
      !dealData.numberOfPeople ||
      !dealData.appointmentDate.trim() || // تأكد أن التاريخ ليس فارغًا
      !dealData.roomAccess ||
      !dealData.price
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = dealData.imageUrl || "/images/Avatar.svg"; // تعيين الصورة الافتراضية

      if (image) {
        imageUrl = await handleImageUpload();
      }

      await addDoc(collection(db, "deals"), {
        ...dealData,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("🎉 Deal Saved");

      setDealData({
        customerName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        roomArea: "",
        numberOfPeople: "",
        appointmentDate: "",
        specialInstructions: "",
        roomAccess: "",
        price: "",
        imageUrl: "",
        status: "inprogress",
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding deal:", error);
      toast.error("Failed to add deal ❌");
    }
    setLoading(false);
  };

  const handleSelectCustomer = (customer: any) => {
    setDealData((prev) => ({
      ...prev,
      customerName: `${customer.firstName} ${customer.lastName}`, // تحديث الاسم فقط
    }));
    setIsCustomerDialogOpen(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 mb-6">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Room"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200" />
          )}
          <label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button variant="outline" className="rounded-full h-8 px-4">
              {uploading ? "Uploading..." : "ADD"}
            </Button>
          </label>
        </div>

        <div className="grid gap-4">
          <div className="space-y-1">
            <Label htmlFor="customerName">Customer</Label>
            <div className="flex gap-2">
              <Input
                id="customerName"
                value={dealData.customerName}
                onChange={handleChange}
              />
              <Button
                variant="outline"
                onClick={() => setIsCustomerDialogOpen(true)}
              >
                Select Customer
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              value={dealData.streetAddress}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={dealData.city} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                value={dealData.state}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={dealData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="roomArea">Room Area (m²)</Label>
              <Input
                id="roomArea"
                value={dealData.roomArea}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="numberOfPeople"># of People</Label>
              <Input
                id="numberOfPeople"
                value={dealData.numberOfPeople}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="appointmentDate">Appointment Date</Label>
            <Input
              id="appointmentDate"
              type="date"
              value={dealData.appointmentDate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Input
              id="specialInstructions"
              value={dealData.specialInstructions}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="roomAccess">Room Access</Label>
              <Input
                id="roomAccess"
                value={dealData.roomAccess}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                value={dealData.price}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 mt-6">
          <Button variant="outline" className="rounded-4xl w-32 h-12">
            Cancel
          </Button>
          <Button
            className="bg-[#514EF3] hover:bg-[#413FCF] rounded-4xl w-36 h-12"
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            {loading ? "Saving..." : "Save Deal"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Dialog for Selecting Customer */}
      <Dialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          <CustomersTable
            onSelectCustomer={handleSelectCustomer}
            isSelectMode={true}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default DealForm;
