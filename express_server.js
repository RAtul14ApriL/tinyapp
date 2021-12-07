const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca" };
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