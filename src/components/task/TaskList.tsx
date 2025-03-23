import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchTasks } from "@/redux/TaskSlice";
import { format, isPast } from "date-fns";

import { PiWarningOctagonFill } from "react-icons/pi";
import { IoCheckbox } from "react-icons/io5";
import { EditTask } from "./EditTask";

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const getStatusIcon = (completed: boolean, dueDate: string) => {
    const isOverdue = isPast(new Date(dueDate));

    if (completed && isOverdue) {
      return (
        <>
          <IoCheckbox className="w-6 h-6 fill-[#2DC8A8] stroke-white" />
          <PiWarningOctagonFill className="w-6 h-6 fill-[#FE8084] stroke-white" />
        </>
      );
    } else if (completed) {
      return <IoCheckbox className="w-6 h-6 fill-[#2DC8A8] stroke-white" />;
    } else if (isOverdue) {
      return (
        <PiWarningOctagonFill className="w-6 h-6 fill-[#FE8084] stroke-white" />
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">Tasks</h2>
      <p className="text-lg font-semibold text-primary mb-4">
        Total Tasks: {tasks.length}
      </p>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3 text-left text-sm font-semibold">
                <IoCheckbox className="w-6 h-6 fill-gray-500 stroke-white" />
              </th>
              <th className="p-3 text-left text-sm font-normal">Due Date</th>
              <th className="p-3 text-left text-sm font-normal">Task</th>
              <th className="p-3 text-left text-sm font-normal">Edit</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const isOverdue = isPast(new Date(task.dueDate));

              return (
                <tr key={task.id} className="border-b">
                  <td className="p-3 flex items-center gap-2">
                    {getStatusIcon(task.completed, task.dueDate)}
                  </td>
                  <td className="p-3">
                    {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </td>
                  <td
                    className={`p-3 font-normal text-sm ${
                      task.completed && isOverdue
                        ? "text-red-500"
                        : task.completed
                        ? "text-primary"
                        : isOverdue
                        ? "text-red-500"
                        : "text-primary"
                    }`}
                  >
                    {task.description}
                  </td>
                  <td className="p-3 font-normal text-sm">
                    <EditTask task={task} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
