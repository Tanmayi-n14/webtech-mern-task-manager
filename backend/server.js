import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key"; // Add a JWT_SECRET to your .env file!

let tasksCollection;
let usersCollection; // New

// ----- Authentication Middleware -----
// This function checks for a valid token in the request header
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user; // Attaches the user payload (e.g., { id: '...' }) to the request
    next();
  });
}

// Connect to MongoDB and then start the server
(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("taskmanager");
    
    tasksCollection = db.collection("tasks");
    usersCollection = db.collection("users"); // Initialize users collection
    
    console.log("✅ Connected to MongoDB (Native Driver)");

    // ---------------------------------
    // ----- AUTH ROUTES (NEW) -----
    // ---------------------------------

    // REGISTER
    app.post("/auth/register", async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required." });
        }
        
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: "Username already taken." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await usersCollection.insertOne({
          username,
          password: hashedPassword,
        });
        
        res.status(201).json({ message: "User registered successfully." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
      }
    });

    // LOGIN
    app.post("/auth/login", async (req, res) => {
      try {
        const { username, password } = req.body;
        
        const user = await usersCollection.findOne({ username });
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials." });
        }
        
        // Create JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
          expiresIn: "1d", // Token expires in 1 day
        });

        res.json({
          token,
          user: { id: user._id, username: user.username }
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
      }
    });

    // ---------------------------------
    // ----- TASK ROUTES (SECURED) -----
    // ---------------------------------

    // GET ALL TASKS (for the logged-in user)
    app.get("/tasks", verifyToken, async (req, res) => {
      try {
        const tasks = await tasksCollection.find({ userId: new ObjectId(req.user.id) }).toArray();
        res.json(tasks);
      } catch (err) {
        res.status(500).json({ message: "Error fetching tasks" });
      }
    });

    // GET SINGLE TASK (for edit page)
    app.get("/tasks/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        
        const task = await tasksCollection.findOne({ 
          _id: new ObjectId(id), 
          userId: new ObjectId(req.user.id) 
        });

        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
      } catch (err) {
        res.status(500).json({ message: "Error fetching task" });
      }
    });

    // CREATE TASK
   app.post("/tasks", verifyToken, async (req, res) => {
   try {
    const newTask = {
      ...req.body,
      completed: false,         // initialize as false
      userId: new ObjectId(req.user.id)
    };
    const result = await tasksCollection.insertOne(newTask);
    const insertedTask = await tasksCollection.findOne({ _id: result.insertedId });
    res.status(201).json(insertedTask);
   } catch (err) {
    res.status(500).json({ message: "Error adding task" });
   }
});

    // UPDATE TASK
   app.put("/tasks/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const { title, description, dueDate, priority, completed } = req.body;
    const updateData = { title, description, dueDate, priority, completed };

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(req.user.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Task not found or user not authorized" });
    }

    res.json({ _id: new ObjectId(id), ...updateData });
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

    // DELETE TASK
    app.delete("/tasks/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
        
        const result = await tasksCollection.deleteOne({ 
          _id: new ObjectId(id), 
          userId: new ObjectId(req.user.id) 
        });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Task not found or user not authorized" });
        }
        
        res.json({ message: "Task deleted" });
      } catch (err) {
        res.status(500).json({ message: "Error deleting task" });
      }
    });

    // Start server after DB connection
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
})();