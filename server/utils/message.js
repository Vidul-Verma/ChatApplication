var moment = require('moment');


var generateMsg = (fromId, fromName, msg) =>{
  return {
    userName: fromName,
    msg: msg,
    createdAt: moment().valueOf()
  };

};

module.exports = {generateMsg};
