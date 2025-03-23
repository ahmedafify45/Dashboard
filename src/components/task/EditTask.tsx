import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "@/redux/TaskSlice"; // ✅ إضافة deleteTask
import { AppDispatch } from "@/redux/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface EditTaskProps {
  task: Task;
}

export function EditTask({ task }: EditTaskProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState<Date | null>(new Date(task.dueDate));
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setDescription(task.description);
    setDueDate(new Date(task.dueDate));
    setCompleted(task.completed);
  }, [task]);

  // ✅ تحديث المهمة عند الحفظ
  const handleSave = async () => {
    if (!dueDate) return;
    try {
      await dispatch(
        updateTask({
          id: task.id,
          description,
          dueDate: dueDate ? dueDate.toISOString() : task.dueDate,
          completed,
        })
      ).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <CiEdit />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] w-[400px] h-[540px] rounded-xl border border-gray-300">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="complete"
                checked={completed}
                onCheckedChange={() => setCompleted(!completed)}
              />
              <label
                htmlFor="complete"
                className="text-sm font-medium leading-none"
              >
                Complete?
              </label>
            </div>

            <div className="flex flex-col gap-4">
              <label
                htmlFor="dueDate"
                className="text-primary font-bold text-[16px]"
              >
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:w-full w-[320px] text-left"
                  >
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate || undefined}
                    onSelect={(date) => setDueDate(date ?? null)}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-4">
              <label
                htmlFor="description"
                className="text-primary font-bold text-[16px]"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="lg:w-full h-[110px] w-[320px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 gap-3">
            <Button
              type="button"
              className="w-[120px] lg:w-[160px] h-[50px] rounded-full text-red-500 bg-white hover:bg-accent"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              type="submit"
              className="w-[120px] lg:w-[160px] h-[50px] rounded-full"
              onClick={handleSave}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
