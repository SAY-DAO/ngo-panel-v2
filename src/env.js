const env = process.env.REACT_APP_NODE_ENV || 'local';

let envApiUrl = '';
let envApiUrl3 = '';
let envApiDao = '';
let envSocket = '';

if (env === 'production') {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_PROD}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_PROD}/api/v3`;
  envApiDao = `https://${process.env.REACT_APP_NEST_SERVER_PROD}/api/dao`;
  envSocket = `https://${process.env.REACT_APP_NEST_SERVER_PROD}/api/dao`;
} else if (env === 'staging') {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_STAGING}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_STAGING}/api/v3`;
  envApiDao = `https://${process.env.REACT_APP_NEST_SERVER_STAGING}/api/dao`;
  envSocket = `https://${process.env.REACT_APP_NEST_SERVER_STAGING}`;
} else if (env === 'development') {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_DEV}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_DEV}/api/v3`;
  envApiDao = `http://${process.env.REACT_APP_NEST_SERVER_DEV}/api/dao`;
  envSocket = `http://${process.env.REACT_APP_NEST_SERVER_DEV}`;
} else {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_LOCAL}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_LOCAL}/api/v3`;
}

const apiUrl = envApiUrl;
const apiUrl3 = envApiUrl3;
const apiDao = envApiDao;
const socketUrl = envSocket;
console.log(env);
console.log(apiUrl);
console.log(apiUrl3);
console.log(apiDao);
console.log(socketUrl);
console.log('-------------------------------------------');
export { apiUrl, apiUrl3, apiDao, socketUrl };
