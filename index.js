const express = require("express");
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(express.json());

const prisma = new PrismaClient();



app.get("/", (req, res) => {
    res.send("Welcome to the Backend!");
});

// Fetch all tasks from the database
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a new task
app.post("/tasks", async (req, res) => {
    
    const { title } = req.body;
    // res.json({ message: "Task creation endpoint hit", title });
    try {
        const task = await prisma.task.create({
            data: { title }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});

// Update task status
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    try {
        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                title,
                completed
            },
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({ where: { id: Number(id) } });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete task' });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});