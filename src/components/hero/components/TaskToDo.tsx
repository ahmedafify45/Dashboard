import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchTasks } from "@/redux/TaskSlice";
import { format, isPast } from "date-fns";
import { IoCheckbox } from "react-icons/io5";
import { PiWarningOctagonFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

function TaskToDo() {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    )
    .slice(0, 6);

  return (
    <section>
      <div className="bg-[#F6FAFD] w-[369px] h-[394px] p-4 rounded-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-primary ">Task To Do</h2>
          <Link to="/tasks" className="text-sm text-[#514EF3]">
            Veiw All
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading tasks...</p>
        ) : completedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No completed tasks available</p>
        ) : (
          <ul className="space-y-3">
            {completedTasks.map((task) => {
              const isOverdue = isPast(new Date(task.dueDate));

              return (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div className="flex items-center gap-2">
                    {isOverdue ? (
                      <PiWarningOctagonFill className="w-6 h-6 fill-[#FE8084] stroke-white" />
                    ) : (
                      <IoCheckbox className="w-6 h-6 fill-[#2DC8A8] stroke-white" />
                    )}
                    <span
                      className={`text-sm ${
                        isOverdue ? "text-red-500" : "text-primary"
                      }`}
                    >
                      {task.description}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(task.dueDate), "dd MMM yyyy")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="bg-white w-[369px] h-[62px] flex items-center justify-between p-4">
        <p className="text-gray-500">Add new task</p>
        <Link to="/tasks">
          <FaArrowRightLong className="text-[#514EF3] cursor-pointer" />
        </Link>
      </div>
    </section>
  );
}

export default TaskToDo;
