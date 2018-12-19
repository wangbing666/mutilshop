/**
 * Created by chenmao on 2017/6/30.
 */
const environment = process.env.env;

module.exports = {
  build: {
    env: environment === 'prod' ? require('./prod.env') : require('./test.env')
  },
  dev: {
    env: require('./dev.env')
  }
};