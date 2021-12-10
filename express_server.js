const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const app = express();
const PORT = 3000;
const bcrypt = require("bcryptjs");
const {generateRandomString, findUser, timeStamp} = require("./helper/helper");
const {urlDatabase, users} = require("./helper/userData")

//**************** **************************** */
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["Danger is real, but fear is a choice", "key"]
}))

//******************************************HOME**
app.get("/", (req, res) => {
  const userID = req.session.userID;
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
    email: req.session.email,
    userID: req.session.userID,
    users: users,
    timeStamp: timeStamp
  };
  const userID = req.session.userID;
  if (!userID) {
    res.render("urls_loggedOut", templateVars);
  }
  res.render("urls_index", templateVars);
});
//*****************************************CREATE NEW URL PAGE*
app.get("/urls/new", (req, res) => {
  const templateVars = {
    email: req.session.email,
    userID: req.session.userID
  }
  const userID = req.session.userID;
  if (!userID) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

//********************************************ADD URL TO URLS PAGE**
app.post("/urls/new", (req, res) => {
  let userID = req.session.userID;
  let longURL = req.body.longURL;
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { "longURL": longURL, "userid": userID, timeStamp: timeStamp };
  const templateVars = {
    urls: urlDatabase,
    email: req.session.email,
    userID: req.session.userID,
    users: users
  };
  req.session.longURL = longURL;
  req.session.shortURL = shortURL;
  //res.send(urlDatabase);
  res.redirect("/urls");
})
//***************************************SHOW SINGLE URL PAGE**
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    urlDatabase: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email: req.session.email,
    userID: req.session.userID,
    timeStamp: timeStamp
  };
  if(!templateVars.userID) {
    return res.status(400).send(`Please Login or Register to see the short URLs`);
  }
  // res.send(urlDatabase[req.params.shortURL].longURL);  
  res.render("urls_show", templateVars);
});
//**************************************************** EDIT URL [NEED SOME WORK]
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  console.log(req.body.longURL);
  console.log(urlDatabase[req.params.shortURL].longURL);
  res.redirect("/urls");
});

//*****************************************************DELETE URL
app.get("/urls/:shortURL/delete", (req, res) => {
  const templateVars = {
    urlDatabase: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email: req.session.email,
    userID: req.session.userID,
    timeStamp: timeStamp
  };
  const userID = req.session.userID;
  if (!userID) {
    res.redirect("/login");
  }
  res.render("delete_url", templateVars);
});
  app.post("/urls/:shortURL/delete", (req, res) => {
    const confirmDelete = () => {
      const urlToDel = req.params.shortURL;
        delete urlDatabase[urlToDel];
        return res.redirect("/urls");
    }
    confirmDelete();   
});
// **************************************************LOGIN
app.get('/login', (req, res) => {
  const templateVars = {
    email: req.session.email,
    userID: req.session.userID
  }
  res.render("login", templateVars);
})
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(403).send("Email and Password cannot be blank");
  }
  const user = findUser(email, users);
  if (!user) {
    return res.status(400).send("No account has been found with this email");
  }
  const passwordMatching = bcrypt.compareSync(password, user.password);
  if (!passwordMatching) {
    return res.status(403).send("Invalid email or password");
  }
  const userID = user.id;
  req.session.userID = userID;
  req.session.email = email;
  console.log(user);
  res.redirect("/urls");
});

// ***************************************************LOGOUT
app.post('/logout', (req, res) => {
  delete req.session.userID;
  delete req.session.email;
  res.redirect('/urls');
});
//***************************************************REGISTER
app.get("/register", (req, res) => {
  const templateVars = {
    email: req.session.email,
    userID: req.session.userID
  }
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Email and Password cannot be blank");
  }
  const user = findUser(email, users);
  if (user) {
    return res.status(400).send("An account already exist with this email address");
  }
  const userID = generateRandomString(4);
  users[userID] = {
    id: userID,
    email: email,
    password: bcrypt.hashSync(password, 10)
  }

  req.session.userID = "userID";
  req.session.email = "email";
  console.log('new user: ', users[userID]);
  res.redirect("/urls");
});

//****************** SERVER************** */
app.listen(PORT, () => {
  console.log(`Server is running...`);
});