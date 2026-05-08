import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Task from "../models/Task";

const makeTask = (overrides = {}) => ({
  text: "Test Task",
  date: "2026-05-10",
  time: "10:00",
  completed: false,
  ...overrides,
});

describe("Task API", () => {
  describe("GET /tasks", () => {
    it("should return empty array", async () => {
      const res = await request(app).get("/tasks");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all tasks", async () => {
      await Task.create(makeTask());
      const res = await request(app).get("/tasks");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("POST /tasks", () => {
    it("should create task", async () => {
      const res = await request(app).post("/tasks").send(makeTask());
      expect(res.status).toBe(201);
      expect(res.body.text).toBe("Test Task");
      expect(res.body.completed).toBe(false);
    });

    it("should return 400 if date missing", async () => {
      const res = await request(app).post("/tasks").send({
        text: "Task",
        time: "10:00",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Enter time and Date");
    });

    it("should return 400 if time missing", async () => {
      const res = await request(app).post("/tasks").send({
        text: "Task",
        date: "2026-05-10",
      });

      expect(res.status).toBe(400);
    });

    it("should return 409 if duplicate exists", async () => {
      await Task.create(makeTask());

      const res = await request(app).post("/tasks").send(makeTask());
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already exists/);
    });
  });

  describe("POST /tasks/bulk", () => {
    it("should create multiple tasks", async () => {
      const res = await request(app)
        .post("/tasks/bulk")
        .send([
          makeTask({
            date: "2026-05-11",
            time: "09:00",
          }),
          makeTask({
            date: "2026-05-11",
            time: "10:00",
          }),
        ]);

      expect(res.status).toBe(201);
      expect(res.body.length).toBe(2);
    });

    it("should return 400 for empty array", async () => {
      const res = await request(app).post("/tasks/bulk").send([]);
      expect(res.status).toBe(400);
    });

    it("should return 400 for non-array body", async () => {
      const res = await request(app).post("/tasks/bulk").send({
        text: "wrong",
      });

      expect(res.status).toBe(400);
    });

    it("should return 409 if clash exists", async () => {
      await Task.create(
        makeTask({
          date: "2026-05-11",
          time: "09:00",
        }),
      );

      const res = await request(app)
        .post("/tasks/bulk")
        .send([
          makeTask({
            date: "2026-05-11",
            time: "09:00",
          }),
        ]);

      expect(res.status).toBe(409);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should get single task", async () => {
      const task = await Task.create(makeTask());
      const res = await request(app).get(`/tasks/${task._id}`);
      expect(res.status).toBe(200);
      expect(res.body.text).toBe("Test Task");
    });

    it("should return 404 if task not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/tasks/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Task not found");
    });

    it("should return 500 for invalid id", async () => {
      const res = await request(app).get("/tasks/invalid-id");
      expect(res.status).toBe(500);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update completed status", async () => {
      const task = await Task.create(makeTask());
      const res = await request(app).put(`/tasks/${task._id}`).send({
        completed: true,
      });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it("should return 404 if task not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).put(`/tasks/${fakeId}`).send({
        completed: true,
      });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete task", async () => {
      const task = await Task.create(makeTask());
      const res = await request(app).delete(`/tasks/${task._id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Deleted");
    });

    it("should return 404 if task not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/tasks/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /tasks/deletemany", () => {
    it("should delete all tasks", async () => {
      await Task.create(makeTask());

      const res = await request(app).delete("/tasks/deletemany");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("All Tasks deleted");
      expect(res.body.deletedCount).toBe(1);
    });

    it("should return 0 when no tasks exist", async () => {
      const res = await request(app).delete("/tasks/deletemany");
      expect(res.status).toBe(200);
      expect(res.body.deletedCount).toBe(0);
    });
  });
});
