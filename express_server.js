const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
//**************** URL generator*************** */
const generateRandomString = () => {
  let shortURL = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(let i = 0; i < 6; i++) {
    shortURL += characters.charAt(Math.floor(Math.random()* characters.length));
  }
  return shortURL;
};
//**************** **************************** */

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//****************Database********************** */
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/******************ROUTERS********************** */
//HOME
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//URLS PAGE
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
//CREATE NEW URL PAGE
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//ADD URL TO URLS PAGE
app.post("/urls", (req, res) => {
  console.log(req.body);
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
})
//UPDATING EXISTING URL PAGE
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
//EDIT URL
app.post('/urls/:shortURL/edit', (req,res) => {
  res.render("/urls_show");
  const newURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[longURL] = {shortURL: newURL, longURL: longURL};
  res.redirect("/urls");
});

//DELETE URL
app.get("/urls/:shortURL/delete", (req, res) => {
  const urlToDel = req.params.shortURL;
  delete urlDatabase[urlToDel];
  res.redirect("/urls");
});

//MISC
app.get("/hello", (req, res) => {
  const templateVars = { "greetings": "Hello!"};
  res.render("hello_world", templateVars);
});

app.get("/gravity", (req, res) => {
  const G = "Gravity";
  res.send(`G for ${G}`);
});

// app.get("/fetch", (req, res) => {
//   res.send(`G for ${G}`);
// })

app.listen(PORT, () => {
  console.log(`Server is running...`);
});