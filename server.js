const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, password are required" });
  }
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.run(sql, [name, email, password], function (err) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ error: "Email already registered" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

app.get("/api/employees", (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM employees WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Employee not found" });
    res.json(row);
  });
});

app.post("/api/employees", (req, res) => {
  const { name, role, email } = req.body;
  if (!name || !role || !email) {
    return res.status(400).json({ error: "name, role, email are required" });
  }
  const sql = "INSERT INTO employees (name, role, email) VALUES (?, ?, ?)";
  db.run(sql, [name, role, email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, role, email });
  });
});

app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, role, email } = req.body;
  const sql = "UPDATE employees SET name = ?, role = ?, email = ? WHERE id = ?";
  db.run(sql, [name, role, email, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Employee not found" });
    res.json({ id, name, role, email });
  });
});

app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM employees WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted" });
  });
});

app.get("/api/tasks", (req, res) => {
  const sql = `
    SELECT t.*, e.name AS employee_name
    FROM tasks t
    LEFT JOIN employees e ON t.employee_id = e.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT t.*, e.name AS employee_name
    FROM tasks t
    LEFT JOIN employees e ON t.employee_id = e.id
    WHERE t.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Task not found" });
    res.json(row);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, description, status, employee_id } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });

  const sql = `
    INSERT INTO tasks (title, description, status, employee_id)
    VALUES (?, ?, ?, ?)
  `;
  db.run(
    sql,
    [title, description || "", status || "pending", employee_id || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        title,
        description: description || "",
        status: status || "pending",
        employee_id: employee_id || null
      });
    }
  );
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status, employee_id } = req.body;

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?, employee_id = ?
    WHERE id = ?
  `;
  db.run(
    sql,
    [title, description, status, employee_id || null, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Task not found" });
      res.json({ id, title, description, status, employee_id });
    }
  );
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  });
});

function sendApp(req, res) {
  res.sendFile(path.join(frontendPath, "index.html"));
}

app.get("/", sendApp);
app.get("/login", sendApp);
app.get("/signup", sendApp);
app.get("/dashboard", sendApp);

app.get("*", sendApp);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
