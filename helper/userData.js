const bcrypt = require("bcryptjs");

//****************URL DATABASE**********************
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userid: "aJ48",
      timeStamp: "9/11/2021 @ 21:38:47"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userid: "aJ48",
      timeStamp: "4/12/2021 @ 22:30:05"
  }
};
//***************USER DATABASE*****************
const users = {
"userRandomID": {
  id: "userRandomID",
  email: "01@abc.com",
  password: bcrypt.hashSync('1234', 10)
},
"user2RandomID": {
  id: "user2RandomID",
  email: "02@abc.com",
  password: bcrypt.hashSync('abcd', 10)
},
"aJ48": {
  id: "aJ48",
  email: "aj@xyz.com",
  password: bcrypt.hashSync('1234', 10)
}
}

module.exports = {urlDatabase, users};