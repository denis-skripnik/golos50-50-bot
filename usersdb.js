var Datastore = require('nedb')
  , db = new Datastore({ filename: 'users.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

  function getUser(userId) {
    return new Promise((resolve, reject) => {
        db.findOne({uid: userId}, (err,data) => {
               if(err) {
                      reject(err);
               } else {
                      resolve(data);
               }
        });
    });
}

function addUser(data) {
  return new Promise((resolve, reject) => {
  db.insert(data, function (err, newDoc) {
if (err) {
  reject(err);
} else {
       resolve(newDoc);
}
    });
  });
  }

function updateUser(id, data) {
  return new Promise((resolve, reject) => {
  db.update({uid: id}, data, {}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
  });
  });
}

function removeUser(tg_id) {
  return new Promise((resolve, reject) => {
    db.remove({ uid: tg_id}, {}, function (err, numRemoved) {
if (err) {
  reject(err);
} else {
       resolve(numRemoved);
}
    });
  });
  }

function findAllUsers() {
  return new Promise((resolve, reject) => {
  db.find({}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
      });
});
}

module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.findAllUsers = findAllUsers;