const environments = {
  staging: {
    port: 3000,
    envName: 'staging',
    hashingSecret : 'thisIsASecret',
    stripeKey: 'sk_test_lo1ZlgnxuMnxKs89tEVTl8H6',
    mailgun: {
      key:'1b98255c738b32afc0dd5670ee08dad0-059e099e-3a1e39b4',
      domain: 'sandbox824ac450a46f49a9a780b04dee162607.mailgun.org',
      from: 'example@example.com'
    },
    templates: `${__dirname}/../templates`,
  },
  production: {
    port: 5000,
    envName: 'production',
    hashingSecret : 'thisIsASecret',
    stripeKey: 'sk_test_lo1ZlgnxuMnxKs89tEVTl8H6',
    mailgun: {
      key:'1b98255c738b32afc0dd5670ee08dad0-059e099e-3a1e39b4',
      domain: 'sandbox824ac450a46f49a9a780b04dee162607.mailgun.org',
      from: 'example@example.com'
    },
    templates: `${__dirname}/../templates`,
  }
}

const env = environments[process.env.NODE_ENV] || environments.staging

module.exports = env