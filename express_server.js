const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

//**************** **************************** */
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//****************Database********************** */
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//************************************************ URL generator**
const generateRandomString = () => {
  let shortURL = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortURL;
};

//******************************************HOME**
app.get("/", (req, res) => {
  const templateVars = {
    username : req.cookies.username
  }
  res.render("index", templateVars);
});
//****************************** */
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//*****************************************URLS PAGE*
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render("urls_index", templateVars);
});
//*****************************************CREATE NEW URL PAGE*
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies.username
  }
  res.render("urls_new", templateVars);
});

//********************************************ADD URL TO URLS PAGE**
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
})
//***************************************UPDATING EXISTING URL PAGE**
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});
//**************************************************** EDIT URL
app.post("/urls/:shortURL/edit", (req, res) => {
  res.render("/urls_show");
  const templateVars = {
    username: req.cookies.username
  }
  const newURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[longURL] = { shortURL: newURL, longURL: longURL };
  res.redirect("/urls", templateVars);
});

//*****************************************************DELETE URL
app.get("/urls/:shortURL/delete", (req, res) => {
  const urlToDel = req.params.shortURL;
  delete urlDatabase[urlToDel];
  res.redirect("/urls");
});
// **************************************************LOGIN
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('urls');
});

// ***************************************************LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})
//****************** SERVER************** */
app.listen(PORT, () => {
  console.log(`Server is running...`);
});