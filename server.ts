import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock Data
let users = [
  { id: 1, username: "admin", email: "admin@test.com", password: "password", role: "SysOp" }
];

let files: any[] = []; // Empty initially

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      userCount: users.length,
      fileCount: files.length
    });
  });

  app.post("/api/register", (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Strict Validation
    if (!username || username.length <= 3) {
      return res.status(400).json({ success: false, message: "Username must be longer than 3 characters." });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters and include letters, numbers, and special characters." });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: "First and Last name are required." });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    
    const newUser = { 
      id: users.length + 1, 
      username, 
      email, 
      password, 
      firstName,
      lastName,
      role: "User" 
    };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, username: newUser.username, role: newUser.role } });
  });

  app.get("/api/files", (req, res) => {
    const { search, category } = req.query;
    let results = [...files];
    
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(f => f.name.toLowerCase().includes(q));
    }
    
    if (category && category !== "All") {
      results = results.filter(f => f.category === category);
    }
    
    res.json(results);
  });

  app.post("/api/upload", (req, res) => {
    const { name, category, size, uploader, type, description } = req.body;
    const newFile = {
      id: files.length + 1,
      name,
      category,
      size,
      uploader,
      date: new Date().toISOString(),
      downloads: 0,
      type,
      description
    };
    files.unshift(newFile);
    res.json({ success: true, file: newFile });
  });

  // Mock download endpoint
  app.get("/api/download/:id", (req, res) => {
    const file = files.find(f => f.id === parseInt(req.params.id));
    if (file) {
      file.downloads++;
      res.json({ success: true, url: `https://example.com/download/${file.name}` }); 
    } else {
      res.status(404).json({ success: false });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (placeholder for now)
    app.use(express.static(path.join(__dirname, "dist")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
