const fs = require("fs");
const uniqid = require("uniqid");

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

// Save users to the users.json file
const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("users.json", dataJSON);
};

// Show details of specific user
const getUser = (id) => {
  const usersData = loadUsers();
  const matchedUser = usersData.find((user) => {
    return id === user.passportID;
  });
  if (matchedUser) {
    return matchedUser;
  } else {
    throw Error(`user id ${id} cannot be found`);
  }
};

// Adding a new user
const addUser = (body) => {
  const usersData = loadUsers();
  const userID = body.passportID;
  const exists = usersData.find((user) => {
    return user.passportID === userID;
  });
  if (exists) {
    throw Error("cannot add user, alredy exists");
  } else {
    const newUser = {
      passportID: uniqid(),
      cash: body.cash === undefined ? 0 : body.cash,
      credit: body.credit === undefined ? 0 : body.credit,
    };
    usersData.push(newUser);
    saveUsers(usersData);
    return newUser;
  }
};

// Depositing
const depositing = (id, cash) => {
  const usersData = loadUsers();
  const userIndex = usersData.findIndex((user) => {
    return user.passportID === id;
  });

  if (userIndex !== -1) {
    usersData[userIndex].cash = cash;
    saveUsers(usersData);
    return usersData[userIndex];
  } else {
    throw Error("cannot find user");
  }
};

module.exports = {
  loadUsers,
  saveUsers,
  getUser,
  addUser,
  depositing,
};
