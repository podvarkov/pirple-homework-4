const environments = {
  staging: {
    port: 3000,
    envName: 'staging'
  },
  production: {
    port: 5000,
    envName: 'production'
  }
};

const env = environments[process.env.NODE_ENV] || environments.staging;

module.exports = env;