const environments = {
  staging: {
    port: 3000,
    envName: 'staging',
    hashingSecret : 'thisIsASecret'
  },
  production: {
    port: 5000,
    envName: 'production',
    hashingSecret : 'thisIsASecret'
  }
};

const env = environments[process.env.NODE_ENV] || environments.staging;

module.exports = env;