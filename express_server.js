const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const bcrypt = require("bcryptjs");

//**************** **************************** */
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//****************URL DATABASE**********************
const urlDatabase = {
    b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userid: "aJ48"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userid: "aJ48"
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
//*********************************************** FUCNTIONS
//************************************************ URL GENERATOR**
const generateRandomString = (length) => {
  let shortURL = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortURL;
};
//***************************************EMAIL CHECKER
const findUser = (email) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

//******************************************HOME**
app.get("/", (req, res) => {
  const userID = req.cookies.userID;
  if (!userID) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});
//****************************** URLs.JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//*****************************************URLS PAGE*
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.cookies.email,
    userID: req.cookies.userID,
    users: users
  };
  const userID = req.cookies.userID;
  if (!userID) {
    res.render("urls_loggedOut", templateVars);
  }
  res.render("urls_index", templateVars);
});
//*****************************************CREATE NEW URL PAGE*
app.get("/urls/new", (req, res) => {
  const templateVars = {
    email: req.cookies.email,
    userID: req.cookies.userID
  }
  const userID = req.cookies.userID;
  if (!userID) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

//********************************************ADD URL TO URLS PAGE**
app.post("/urls/new", (req, res) => {
  let userID = req.cookies.userID;
  let longURL = req.body.longURL;
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { "longURL": longURL, "userid": userID };
  const templateVars = {
    urls: urlDatabase,
    email: req.cookies.email,
    userID: req.cookies.userID,
    users: users
  };
  res.cookie("longURL", longURL);
  res.cookie("shortURL", shortURL);
  // res.send(urlDatabase);
  res.redirect("/urls");
})
//***************************************UPDATING EXISTING URL PAGE**
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    urlDatabase: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email: req.cookies.email,
    userID: req.cookies.userID
  };
  if(!templateVars.userID) {
    return res.status(400).send(`Please Login or Register to see the short URLs`);
  }
    res.render("urls_show", templateVars);
});
//**************************************************** EDIT URL [NEED SOME WORK]
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

//*****************************************************DELETE URL
app.get("/urls/:shortURL/delete", (req, res) => {
  const urlToDel = req.params.shortURL;
  delete urlDatabase[urlToDel];
  res.redirect("/urls");
});
// **************************************************LOGIN
app.get('/login', (req, res) => {
  const templateVars = {
    email: req.cookies.email,
    userID: req.cookies.userID
  }
  res.render("login", templateVars);
})
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(403).send("Email and Password cannot be blank");
  }
  const user = findUser(email);
  if (!user) {
    return res.status(400).send("No account has been found with this email");
  }
  const passwordMatching = bcrypt.compareSync(password, user.password);
  if (!passwordMatching) {
    return res.status(403).send("Invalid email or password");
  }
  //console.log(users);
  res.cookie("userID", user.id);
  res.cookie("email", email)
  res.redirect("/urls");
});

// ***************************************************LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.clearCookie('email');
  res.redirect('/urls');
});
//***************************************************REGISTER
app.get("/register", (req, res) => {
  const templateVars = {
    email: req.cookies.email,
    userID: req.cookies.userID
  }
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Email and Password cannot be blank");
  }
  const user = findUser(email);
  if (user) {
    return res.status(400).send("An account already exist with this email address");
  }
  const userID = generateRandomString(4);
  users[userID] = {
    id: userID,
    email: email,
    password: bcrypt.hashSync(password, 10)
  }

  res.cookie("userID", userID);
  res.cookie("email", email);
  console.log('new user: ', users[userID]);
  res.redirect("/urls");
});

//****************** SERVER************** */
app.listen(PORT, () => {
  console.log(`Server is running...`);
});