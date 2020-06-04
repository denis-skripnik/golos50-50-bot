var Datastore = require('nedb')

db2 = new Datastore({ filename: 'witnesses.db', autoload: true });
db2.persistence.setAutocompactionInterval(1000 * 1800);

async function findWitness(witness_owner) {
    return new Promise((resolve, reject) => {
    db2.findOne({witness: witness_owner}, (err, result) => {
        if (err) {
            reject(err);
          } else {
                 resolve(result);
          }
    });
    });
}

async function updateWitness(owner, witnessObj) {
    return new Promise((resolve, reject) => {
    db2.update({witness: owner}, witnessObj, {upsert:true}, (err, result) => {
        if (err) {
            reject(err);
          } else {
                 resolve(result);
          }
    });
    });
}

async function findWitnesses(obj) {
    return new Promise((resolve, reject) => {
        db2.find(obj, (err, result) => {
            if (err) {
                reject(err);
              } else {
                     resolve(result);
              }
        });
        });
}

module.exports.findWitness = findWitness;
module.exports.updateWitness = updateWitness;
module.exports.findWitnesses = findWitnesses;
