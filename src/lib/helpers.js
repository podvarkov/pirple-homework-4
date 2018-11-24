const crypto = require('crypto');
const config = require('./config')

//uuid v4 implementation
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
})

//safe JSON.parse
const safeParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return {}
  }
}

// Create a SHA256 hash
const hash = function(str){
  if(typeof(str) === 'string' && str.length > 0){
    return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
  } else {
    return false;
  }
};

//check token helper
const parseToken = (token) => token ? token.replace('Bearer ', '') : null

module.exports = {
  safeParse,
  uuid,
  hash,
  parseToken
}