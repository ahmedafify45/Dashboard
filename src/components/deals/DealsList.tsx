import { useEffect, useState, useMemo, useCallback } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { FaPen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function DealList() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingDeal, setEditingDeal] = useState<any | null>(null);
  const [editedDeal, setEditedDeal] = useState<any | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "deals"));
        const dealList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(dealList);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
      setLoading(false);
    };

    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) =>
      deal.streetAddress.toLowerCase().includes(search.toLowerCase())
    );
  }, [deals, search]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleEditClick = (deal: any) => {
    setEditingDeal(deal);
    setEditedDeal({ ...deal });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedDeal({ ...editedDeal, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editedDeal) return;

    try {
      const dealRef = doc(db, "deals", editedDeal.id);
      await updateDoc(dealRef, editedDeal);

      setDeals((prev) =>
        prev.map((deal) => (deal.id === editedDeal.id ? editedDeal : deal))
      );

      setEditingDeal(null);
      setEditedDeal(null);
    } catch (error) {
      console.error("Error updating deal:", error);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-6 text-lg text-gray-600">Loading deals...</p>
    );

  return (
    <div className="p-6 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-primary">
        <h2 className="text-2xl font-semibold text-primary">Deals</h2>
        <Input
          type="text"
          placeholder="Search by address..."
          className="w-64"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <p className="text-lg font-semibold text-primary mb-4">
        Total Deals: {deals.length}
      </p>

      {/* Table or No Deals Message */}
      {filteredDeals.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-400">
                <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                  <img src="/images/user.svg" alt="" />
                </th>
                <th className="p-3 text-left text-sm font-semibold">Name</th>
                <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                  Area
                </th>
                <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                  Appointment Date
                </th>
                <th className="p-3 text-left text-sm font-semibold">Price</th>
                <th className="p-3 text-left text-sm font-semibold hidden lg:table-cell">
                  Status
                </th>
                <th className="p-3 text-left text-sm font-semibold">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="border-b transition-colors">
                  <td className="p-3 text-primary hidden lg:table-cell">
                    <img
                      src={deal.imageUrl || "/images/Avatar.svg"}
                      alt="Deal"
                      className="w-16 h-16 object-cover rounded-full"
                      loading="lazy"
                    />
                  </td>
                  <td className="p-3 text-primary">
                    {deal.streetAddress}, <span>{deal.city}</span>
                    <span className="hidden lg:inline-block">
                      , {deal.state}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {deal.roomArea} M²
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {deal.appointmentDate}
                  </td>
                  <td className="p-3 font-semibold">${deal.price}</td>
                  <td className="p-3 hidden lg:table-cell">
                    <span
                      className={`px-4 py-3 text-center rounded-full text-sm font-semibold
                        ${
                          deal.status === "inprogress"
                            ? "bg-[#ECECFE] text-[#514EF3]"
                            : deal.status === "closed"
                            ? "bg-[#ECECFE] text-[#514EF3]"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      className="border-none bg-transparent shadow-0 text-gray-500"
                      onClick={() => handleEditClick(deal)}
                    >
                      <FaPen />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-6 text-lg text-gray-500 bg-white p-4">
          Deals not found
        </p>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              name="streetAddress"
              value={editedDeal?.streetAddress || ""}
              onChange={handleChange}
              placeholder="Street Address"
            />
            <Input
              name="city"
              value={editedDeal?.city || ""}
              onChange={handleChange}
              placeholder="City"
            />
            <Input
              name="state"
              value={editedDeal?.state || ""}
              onChange={handleChange}
              placeholder="State"
            />
            <Input
              name="price"
              value={editedDeal?.price || ""}
              onChange={handleChange}
              placeholder="Price"
            />
            <Input
              name="appointmentDate"
              value={editedDeal?.appointmentDate || ""}
              onChange={handleChange}
              placeholder="Appointment Date"
            />
            {/* إضافة حقل `status` */}
            <select
              name="status"
              value={editedDeal?.status || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="inprogress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingDeal(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DealList;
