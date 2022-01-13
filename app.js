const express = require("express");
const fs = require("fs");
const uniqid = require("uniqid");
const app = express();
const PORT = 3000;

app.use(express.json());

// Show details of all users
app.get("/users", (req, res) => {
  const usersData = loadUsers();
  res.status(200).send(usersData);
});

// Show details of specific user
app.get("/users/:id", (req, res) => {
  const usersData = loadUsers();
  const userID = req.params.id;
  const matchedUser = usersData.find((user) => {
    return userID === user.passportID;
  });
  if (matchedUser) {
    res.status(200).send(matchedUser);
  } else {
    res.status(400).send(`user id ${userID} cannot be found`);
  }
});

// Adding a new user
app.post("/users", (req, res) => {
  const usersData = loadUsers();
  const newUser = req.body;
  const exists = usersData.find((user) => {
    return user.passportID === newUser;
  });
  if (exists) {
    res.status(400).send("cannot add user, alredy exists");
  } else {
    usersData.push({
      passportID: uniqid(),
      cash: newUser.cash,
      credit: newUser.credit,
    });
    res.status(201).send(usersData);
    saveUsers(usersData);
  }
});

// Update users cash
app.put("/users/:id", (req, res) => {
  const usersData = loadUsers();
  const userID = req.params.id;
  const userNewCash = req.body.cash;
  const userNewCredit = req.body.credit;

  const userIndex = usersData.findIndex((user) => {
    return user.passportID === userID;
  });

  if (userIndex !== -1) {
    usersData[userIndex].cash = userNewCash;
    res.status(200).send(usersData[userIndex]);
    saveUsers(usersData);
  } else {
    res.status(400).send("cannot find user");
  }
});

// Save users to the users.json file
const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("users.json", dataJSON);
};

// Load users from the users.json file
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync("users.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

app.listen(PORT, (req, res) => {
  console.log(`listenning on port ${PORT} `);
});
