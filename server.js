const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = Number(process.env.PORT) || 5050;

// MongoDB connection URL
// Docker Compose will provide MONGO_URL using the environment variable.
const MONGO_URL =
    process.env.MONGO_URL ||
    "mongodb://admin:qwerty@localhost:27017/?authSource=admin";

const DB_NAME = "test-db";
const COLLECTION_NAME = "users";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Create MongoDB client
const client = new MongoClient(MONGO_URL);

let usersCollection;

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const users = await usersCollection.find({}).toArray();

        res.status(200).json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);

        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

// POST a new user
app.post("/addUser", async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Request body is empty. Send form data or JSON."
            });
        }

        const result = await usersCollection.insertOne(req.body);

        console.log("User inserted with ID:", result.insertedId);

        return res.status(201).json({
            message: "User added successfully",
            insertedId: result.insertedId
        });
    } catch (error) {
        console.error("Failed to add user:", error);

        return res.status(500).json({
            error: "Failed to add user"
        });
    }
});

// Start the server after connecting to MongoDB
async function startServer() {
    try {
        await client.connect();

        const db = client.db(DB_NAME);
        usersCollection = db.collection(COLLECTION_NAME);

        console.log("Connected successfully to MongoDB");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);

        await client.close().catch(() => {});

        process.exit(1);
    }
}

// Gracefully close MongoDB when the application stops
async function shutDown() {
    console.log("Shutting down server...");

    await client.close().catch((error) => {
        console.error("Error closing MongoDB connection:", error);
    });

    process.exit(0);
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

// Run the application
startServer();
