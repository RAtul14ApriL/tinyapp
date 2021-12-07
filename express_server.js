const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const generateRandomString = () => {
  let shortURL = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(let i = 0; i < 6; i++) {
    shortURL += characters.charAt(Math.floor(Math.random()* characters.length));
  }
  return shortURL;
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  //let longURL = req.body.longURL;
  res.render("urls_show", templateVars);
}); 

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