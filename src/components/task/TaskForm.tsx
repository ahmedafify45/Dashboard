import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "react-toastify";
import { format } from "date-fns";

export function TasksForm({ children }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSaveTask = async () => {
    if (!taskDescription.trim() || !dueDate) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        description: taskDescription,
        dueDate: Timestamp.fromDate(dueDate),
        status: "Pending",
        createdAt: Timestamp.now(),
      });

      toast.success("Task added successfully!");
      setTaskDescription("");
      setDueDate(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{
          width: "400px",
          height: "460px",
          borderRadius: "12px",
          border: "1px solid #EAEEF4",
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="taskDescription"
            placeholder="Enter task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-[366px] h-[110px]"
          />
          <div className="flex flex-col gap-4">
            <label
              htmlFor="dueDate"
              className="text-primary font-bold text-[16px]"
            >
              Due Date
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left bg-white border border-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  {dueDate ? format(dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={(date) => setDueDate(date ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center justify-between px-4">
          <Button
            type="button"
            className="w-[160px] h-[50px] rounded-full bg-white text-black hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTask}
            className="w-[160px] h-[50px] rounded-full"
          >
            Save Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
