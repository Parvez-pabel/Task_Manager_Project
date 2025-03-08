const TaskModel = require("../models/TaskModel");

//create task
exports.createTask = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.email = req.headers.email;
    const newTask = await TaskModel.create(reqBody);
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

//Delete Task

exports.deleteTask = async (req, res) => {
  try {
    let taskID = req.params.id;
    let Query = { _id: taskID };
    await TaskModel.deleteOne(Query);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};
//update Task status
exports.updateStatusTask = async (req, res) => {
  try {
    let taskID = req.params.id;
    let status = req.params.status;
    let Query = { _id: taskID };
    let reqBody = { status: status };
    await TaskModel.updateOne(Query, reqBody, { new: true });
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};
//update task

exports.updateTask = async (req, res) => {
  try {
    let taskID = req.params.id;
    let reqBody = req.body;
    let Query = { _id: taskID };
    let updatedTask = await TaskModel.updateOne(Query, reqBody, { new: true });
    res
      .status(200)
      .json({ message: "Task updated successfully", updatedTask: updatedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};
//get all task

exports.getAllTasks = async (req, res) => {
  try {
    let email = req.headers.email;
    let Query = { email: email };
    const tasks = await TaskModel.find(Query);
    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread existing document fields
      createdAt: new Date(task.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }), // Format date
    }));
    res.status(200).json({ message: "All tasks", tasks: formattedTasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting tasks", error: error.message });
  }
};

//task select by status

exports.getTaskByStatus = async (req, res) => {
  try {
    let email = req.headers.email;
    let status = req.params.status;
    let Query = { email: email, status: status };
    const tasks = await TaskModel.find(Query);
    //change the date format
    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread existing document fields
      createdAt: new Date(task.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }), // Format date
    }));

    res.status(200).json({ message: "Tasks by status", tasks: formattedTasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting tasks by status", error: error.message });
  }
};
// Task count by status & total task

exports.countTasksByStatus = async (req, res) => {
  try {
    let email = req.headers.email;
    let Query = { email: email };
    const tasks = await TaskModel.find(Query);
    const totalTasks = tasks.length; //tasks.length দিয়ে মোট কতগুলো টাস্ক আছে তা বের করা হয়েছে।  
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1; //acc হলো Accumulator (একটি ফাঁকা অবজেক্ট {} শুরুতে) task.status মান অনুযায়ী কাউন্ট ইনক্রিমেন্ট করা হচ্ছে।
      //যদি acc[task.status] আগে না থাকে, তাহলে এটি 0 ধরা হবে, তারপর +1 যোগ হবে। যদি এটি আগে থাকে, তাহলে পুরোনো মানের সাথে +1 হবে।
      return acc;
    }, {});

    res.status(200).json({
      message: "Tasks count by status and total tasks",
      statusCounts,
      totalTasks,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error counting tasks by status",
        error: error.message,
      });
  }
};
