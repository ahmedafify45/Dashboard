import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCustomers } from "@/redux/customerSlice";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiEdit } from "react-icons/ci";

const CustomersTable = ({
  onSelectCustomer,
  isSelectMode = false,
}: {
  onSelectCustomer?: (customer: any) => void;
  isSelectMode?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customers
  );
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<
    (typeof customers)[number] | null
  >(null);
  const [editedData, setEditedData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  const handleEdit = useCallback((customer: (typeof customers)[number]) => {
    setEditingCustomer(customer);
    setEditedData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (editingCustomer) {
      try {
        const customerRef = doc(db, "customers", editingCustomer.id);
        await updateDoc(customerRef, editedData);
        setEditingCustomer(null);
        dispatch(fetchCustomers());
        toast.success("Customer updated successfully!");
      } catch (error) {
        console.error("Error updating customer:", error);
        toast.error("Failed to update customer.");
      }
    }
  }, [editingCustomer, editedData, dispatch]);

  const handleDelete = useCallback(async () => {
    if (editingCustomer) {
      try {
        await deleteDoc(doc(db, "customers", editingCustomer.id));
        setEditingCustomer(null);
        dispatch(fetchCustomers());
        toast.success("Customer deleted successfully!");
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer.");
      }
    }
  }, [editingCustomer, dispatch]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  return (
    <div className="p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6 text-primary gap-2">
        <h2 className="text-2xl font-semibold text-primary">Customers</h2>
        <Input
          type="text"
          placeholder="Search by name..."
          className="lg:w-64"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <p className="text-lg font-semibold text-primary mb-4">
        Total Customers: {customers.length}
      </p>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-400">
              {!isSelectMode && (
                <th className="p-3 text-left text-sm font-semibold">Avatar</th>
              )}
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              {!isSelectMode && (
                <>
                  <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                    Email
                  </th>
                  <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                    Phone
                  </th>
                  <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                    Address
                  </th>
                </>
              )}
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b">
                {!isSelectMode && (
                  <td className="p-3">
                    <img
                      src={customer.imageUrl || "/images/Avatar.svg"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full border"
                      loading="lazy"
                    />
                  </td>
                )}
                <td className="p-3 text-primary">
                  {customer.firstName} {customer.lastName}
                </td>
                {!isSelectMode && (
                  <>
                    <td className="p-3 hidden lg:table-cell">
                      {customer.email}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      {customer.phone}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      {customer.address}
                    </td>
                  </>
                )}
                <td className="p-3 flex gap-2">
                  {!isSelectMode && (
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(customer)}
                    >
                      <CiEdit />
                    </Button>
                  )}
                  {onSelectCustomer && (
                    <Button
                      variant="outline"
                      onClick={() => onSelectCustomer(customer)}
                    >
                      Select
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Dialog for Editing Customer */}
      {!isSelectMode && (
        <Dialog
          open={!!editingCustomer}
          onOpenChange={() => setEditingCustomer(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                name="firstName"
                value={editedData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <Input
                name="lastName"
                value={editedData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <Input
                name="email"
                value={editedData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <Input
                name="phone"
                value={editedData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <Input
                name="address"
                value={editedData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default React.memo(CustomersTable);
