const { assert } = require('chai');

const { findUser } = require('../helper');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUser', function() {
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id === expectedUserID, true);
  });
  it('should return null with invalid email', function() {
    const user = findUser("user3@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user === null, true);
  });
});