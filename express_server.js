const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 3000;

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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n");
})

app.get("/gravity", (req, res) => {
  const G = "Gravity";
  res.send(`G for ${G}`);
})

// app.get("/fetch", (req, res) => {
//   res.send(`G for ${G}`);
// })

app.listen(PORT, () => {
  console.log(`Server is running...`);
});