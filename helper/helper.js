const {users} = require("./userData");

//********** HELPER FUCNTIONS
//************************** URL GENERATOR**
const generateRandomString = (length) => {
  let shortURL = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortURL;
};
//**********************EMAIL CHECKER
const findUser = (email, users) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

//*************** TIMESTAMP ******/
const currentdate = new Date(); 
const timeStamp = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ "  + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

module.exports = {generateRandomString, findUser, timeStamp};