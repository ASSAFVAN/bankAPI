const express = require("express");
const app = express();

const {
  loadUsers,
  saveUsers,
  getUser,
  addUser,
  depositing,
} = require("./utils");

const PORT = 3000;

app.use(express.json());

// Show details of all users
app.get("/users", (req, res) => {
  const usersData = loadUsers();
  try {
    res.status(200).send(usersData);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Show details of specific user
app.get("/users/:id", (req, res) => {
  try {
    res.status(200).send(getUser(req.params.id));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post("/users", (req, res) => {
  try {
    res.status(201).send(addUser(req.body));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Update users cash
app.put("/users/:id", (req, res) => {
  try {
    res.status(200).send(depositing(req.params.id, req.body.cash));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`listenning on port ${PORT} `);
});
