const express = require("express");
const app = express();

const {
  loadUsers,
  getUser,
  addUser,
  depositing,
  creditUpdate,
  withdrawMoney,
  transferring,
} = require("./utils");

const PORT = 3000;

app.use(express.json());

app.get("/users", (req, res) => {
  const usersData = loadUsers();
  try {
    res.status(200).send(usersData);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

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

app.put("/users/:id", (req, res) => {
  switch (req.query.action) {
    case "depositing":
      try {
        res.status(200).send(depositing(req.params.id, req.body.cash));
      } catch (e) {
        res.status(400).send({ error: e.message });
      }
      break;
    case "creditUpdate":
      try {
        res.status(200).send(creditUpdate(req.params.id, req.body.money));
      } catch (e) {
        res.status(400).send({ error: e.message });
      }
      break;
    case "withdrawMoney":
      try {
        res.status(200).send(withdrawMoney(req.params.id, req.body.money));
      } catch (e) {
        res.status(400).send({ error: e.message });
      }
      break;
    case "transferring":
      try {
        res
          .status(200)
          .send(transferring(req.params.id, req.body.id, req.body.money));
      } catch (e) {
        res.status(400).send({ error: e.message });
      }
      break;
  }
});

app.listen(PORT, (req, res) => {
  console.log(`listenning on port ${PORT} `);
});
