export function isValidTask(taskText) {
  return typeof taskText === "string" && taskText.trim().length > 0;
}

export function createTask(taskText) {
  if (!isValidTask(taskText)) {
    throw new Error("Task cannot be empty");
  }

  return {
    id: Date.now(),
    text: taskText.trim(),
    completed: false,
  };
}

export function toggleTask(tasks, taskId) {
  return tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );
}

export function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function filterTasks(tasks, filter) {
  if (filter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  if (filter === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  return tasks;
}
