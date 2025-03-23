/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
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

function CustomerForm({ children }: any) {
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({ ...customerData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    setUploading(true);
    const storageRef = ref(storage, `customers/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          toast.error("Image upload failed ❌");
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          toast.success("Image uploaded successfully ✅");
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (
      !customerData.firstName ||
      !customerData.email ||
      !customerData.phone ||
      !customerData.address
    ) {
      toast.error("Please fill in all required fields ❌", {
        description: "First Name, Email, Phone, and Address are required.",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = customerData.imageUrl;
      if (image) {
        imageUrl = await handleImageUpload();
      }

      await addDoc(collection(db, "customers"), {
        ...customerData,
        imageUrl,
        createdAt: new Date(),
      });

      toast.success("Customer added successfully ✅");

      setCustomerData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        imageUrl: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer ❌", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 mb-6">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Avatar"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={customerData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={customerData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={customerData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={customerData.address}
              onChange={handleChange}
            />
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
            {loading ? "Saving..." : "Save Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerForm;
