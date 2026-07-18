import { describe, expect, test } from "vitest";

import {
  createTask,
  deleteTask,
  filterTasks,
  isValidTask,
  toggleTask,
} from "./taskService.js";

describe("isValidTask", () => {
  test("accepts a non-empty task", () => {
    expect(isValidTask("Learn GitHub Actions")).toBe(true);
  });

  test("rejects an empty task", () => {
    expect(isValidTask("")).toBe(false);
  });

  test("rejects a task containing only spaces", () => {
    expect(isValidTask("     ")).toBe(false);
  });

  test("rejects non-string values", () => {
    expect(isValidTask(null)).toBe(false);
    expect(isValidTask(undefined)).toBe(false);
    expect(isValidTask(25)).toBe(false);
  });
});

describe("createTask", () => {
  test("creates a pending task", () => {
    const task = createTask("Learn CI/CD");

    expect(task.text).toBe("Learn CI/CD");
    expect(task.completed).toBe(false);
    expect(task.id).toEqual(expect.any(Number));
  });

  test("creates a task with medium priority", () => {
    const task = createTask("Learn branches");

    expect(task.priority).toBe("medium");
  });

  test("removes extra spaces from the task text", () => {
    const task = createTask("   Learn automated testing   ");

    expect(task.text).toBe("Learn automated testing");
  });

  test("throws an error for an empty task", () => {
    expect(() => createTask("   ")).toThrow("Task cannot be empty");
  });
});

describe("toggleTask", () => {
  test("changes a pending task to completed", () => {
    const tasks = [
      {
        id: 1,
        text: "Learn testing",
        completed: false,
      },
      {
        id: 2,
        text: "Learn deployment",
        completed: false,
      },
    ];

    const updatedTasks = toggleTask(tasks, 1);

    expect(updatedTasks[0].completed).toBe(true);
    expect(updatedTasks[1].completed).toBe(false);
  });

  test("changes a completed task back to pending", () => {
    const tasks = [
      {
        id: 1,
        text: "Learn testing",
        completed: true,
      },
    ];

    const updatedTasks = toggleTask(tasks, 1);

    expect(updatedTasks[0].completed).toBe(false);
  });

  test("does not change the original array", () => {
    const tasks = [
      {
        id: 1,
        text: "Learn testing",
        completed: false,
      },
    ];

    toggleTask(tasks, 1);

    expect(tasks[0].completed).toBe(false);
  });
});

describe("deleteTask", () => {
  test("removes the selected task", () => {
    const tasks = [
      {
        id: 1,
        text: "Learn testing",
        completed: false,
      },
      {
        id: 2,
        text: "Learn deployment",
        completed: false,
      },
    ];

    const remainingTasks = deleteTask(tasks, 1);

    expect(remainingTasks).toHaveLength(1);
    expect(remainingTasks[0].id).toBe(2);
  });

  test("keeps all tasks when the ID does not exist", () => {
    const tasks = [
      {
        id: 1,
        text: "Learn testing",
        completed: false,
      },
    ];

    const remainingTasks = deleteTask(tasks, 99);

    expect(remainingTasks).toEqual(tasks);
  });
});

describe("filterTasks", () => {
  const tasks = [
    {
      id: 1,
      text: "Pending task",
      completed: false,
    },
    {
      id: 2,
      text: "Completed task",
      completed: true,
    },
    {
      id: 3,
      text: "Another pending task",
      completed: false,
    },
  ];

  test("returns all tasks", () => {
    expect(filterTasks(tasks, "all")).toEqual(tasks);
  });

  test("returns only completed tasks", () => {
    const result = filterTasks(tasks, "completed");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
    expect(result[0].completed).toBe(true);
  });

  test("returns only pending tasks", () => {
    const result = filterTasks(tasks, "pending");

    expect(result).toHaveLength(2);
    expect(result.every((task) => !task.completed)).toBe(true);
  });
});
