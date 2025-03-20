const TaskModel = require("../models/TaskModel");

//create task
exports.createTask = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.email = req.headers.email;
    const newTask = await TaskModel.create(reqBody);
    res
      .status(200)
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

// exports.getTaskByStatus = async (req, res) => {
//   try {
//     let email = req.headers.email;
//     let status = req.params.status;
//     let Query = { email: email, status: status };
//     const tasks = await TaskModel.find(Query);
//     //change the date format
//     const formattedTasks = tasks.map((task) => ({
//       ...task._doc, // Spread existing document fields
//       createdAt: new Date(task.createdAt).toLocaleDateString("en-US", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }), // Format date
//     }));

//     res.status(200).json({ message: "Tasks by status", tasks: formattedTasks });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error getting tasks by status", error: error.message });
//   }
// };
exports.getTaskByStatus = async (req, res) => {
  try {
    let email = req.headers.email;
    let status = req.params.status;

    console.log("Fetching tasks for email:", email, "with status:", status);

    let Query = { email: email, status: status };
    const tasks = await TaskModel.find(Query).lean(); // Ensure plain JSON

    console.log("Total Tasks Found:", tasks.length);

    // Format the createdAt date
    const formattedTasks = tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    res.status(200).json({ message: "Tasks by status", tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Error getting tasks by status",
      error: error.message,
    });
  }
};

// Task count by status & total task

exports.countTasksByStatus = (req, res) => {

  let email = req.headers.email;
  TaskModel.aggregate([
    { $match: { email: email } },
    {$group:{_id:"$status",sum:{$count:{}}}}
  ], (err, data) => {
    if(err){
      console.error(err);
      return res.status(500).json({ message: "Error getting tasks by status", error: err.message });
    }
    const totalTasks = data.reduce((acc, curr) => acc + curr.sum, 0);
    res.status(200).json({ message: "Tasks by status", tasksByStatus: data, totalTasks: totalTasks });
  })
  
};
