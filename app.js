const express = require("express");
const fs = require("fs");
const uniqid = require("uniqid");
const app = express();
const PORT = 300;

app.use(express.json());

const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("users.json", dataJSON);
};

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
