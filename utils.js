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

//Update credit
const creditUpdate = (id, money) => {
  if (money <= 0) {
    throw Error("positive money only");
  } else {
    const usersData = loadUsers();
    const userIndex = usersData.findIndex((user) => {
      return user.passportID === id;
    });
    if (userIndex !== -1) {
      usersData[userIndex].credit = usersData[userIndex].credit + money;
      saveUsers(usersData);
      return usersData[userIndex];
    } else {
      throw Error("cannot find user");
    }
  }
};

// Withdraw money

const withdrawMoney = (id, money) => {
  if (money < 0) {
    throw Error("positive money only");
  } else {
    const usersData = loadUsers();
    const userIndex = usersData.findIndex((user) => {
      return user.passportID === id;
    });
    let userCash = usersData[userIndex].cash;
    let userCredit = usersData[userIndex].credit;
    if (userIndex !== -1) {
      if (money > userCash + userCredit) {
        throw Error("cannot withdraw that amount. try a lower amount");
      } else if (userCash >= money) {
        userCash -= money;
        saveUsers(usersData);
        return usersData[userIndex];
      } else {
        money -= userCash;
        userCash = 0;
        userCredit -= money;
        saveUsers(usersData);
        return usersData[userIndex];
      }
    } else {
      throw Error("cannot find user");
    }
  }
};

const transferring = (transferringID, recievingID, money) => {
  if (money < 0) {
    throw Error("positive money only");
  } else {
    const usersData = loadUsers();
    const transferringUserIdx = usersData.findIndex((user) => {
      return user.passportID === transferringID;
    });
    const recievingUserIdx = usersData.findIndex((user) => {
      return user.passportID === recievingID;
    });
    let userCash = usersData[transferringUserIdx].cash;
    let userCredit = usersData[transferringUserIdx].credit;

    if (transferringUserIdx !== -1 && recievingUserIdx !== -1) {
      if (money > userCash + userCredit) {
        throw Error("cannot transfer that amount. try a lower amount");
      } else if (userCash >= money) {
        userCash -= money;
        usersData[recievingUserIdx].cash += money;
        saveUsers(usersData);
        return [usersData[transferringUserIdx], usersData[recievingUserIdx]];
      } else {
        usersData[recievingUserIdx].cash += money;
        money -= usersData[transferringUserIdx].cash;
        // userCash = 0;
        usersData[transferringUserIdx].cash = 0;
        usersData[transferringUserIdx].credit -= money;
        saveUsers(usersData);
        return [usersData[transferringUserIdx], usersData[recievingUserIdx]];
      }
    } else {
      throw Error("one or two users dont exist");
    }
  }
};

module.exports = {
  loadUsers,
  saveUsers,
  getUser,
  addUser,
  depositing,
  creditUpdate,
  withdrawMoney,
  transferring,
};
