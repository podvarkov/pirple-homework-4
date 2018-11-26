const https = require("https");
const {safeParse} = require("./helpers");

const request = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk)
      });
      res.on('end', () => {
        const body = safeParse(Buffer.concat(chunks).toString())
        const status = res.statusCode
        if (res.statusCode === 200) {
          resolve({status, body})
        } else {
          reject({status, message: body.error})
        }
      });
    });

    req.on('error', (e) => {
      reject(e.message)
    });

// write data to request body
    req.write(data);
    req.end();
  })
}

module.exports = request