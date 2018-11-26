const environments = {
  staging: {
    port: 3000,
    envName: 'staging',
    hashingSecret : 'thisIsASecret',
    stripeKey: 'sk_test_lo1ZlgnxuMnxKs89tEVTl8H6'
  },
  production: {
    port: 5000,
    envName: 'production',
    hashingSecret : 'thisIsASecret',
    stripeKey: 'sk_test_lo1ZlgnxuMnxKs89tEVTl8H6'
  }
}

const env = environments[process.env.NODE_ENV] || environments.staging

module.exports = env