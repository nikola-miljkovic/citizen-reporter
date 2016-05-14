var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'citizen-reporter'
    },
    port: 3000,
    db: 'mongodb://localhost/citizen-reporter-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'citizen-reporter'
    },
    port: 3000,
    db: 'mongodb://localhost/citizen-reporter-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'citizen-reporter'
    },
    port: 3000,
    db: 'mongodb://localhost/citizen-reporter-production'
  }
};

module.exports = config[env];
