const env = process.env.REACT_APP_NODE_ENV || 'local';

let envApiUrl = '';
let envApiUrl3 = '';
let envBaseUrl = '';

if (env === 'prod') {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_PROD}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_PROD}/api/v3`;
  envBaseUrl = process.env.REACT_APP_DOMAIN_PROD;
} else if (env === 'stag') {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_STAGING}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_STAGING}/api/v3`;
  envBaseUrl = process.env.REACT_APP_DOMAIN_STAGING;
} else if (env === 'development') {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_DEV}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_DEV}/api/v3`;
  envBaseUrl = process.env.REACT_APP_DOMAIN_DEV;
} else {
  envApiUrl = `https://${process.env.REACT_APP_DOMAIN_LOCAL}/api/v2`;
  envApiUrl3 = `https://${process.env.REACT_APP_DOMAIN_LOCAL}/api/v3`;
  envBaseUrl = process.env.REACT_APP_DOMAIN_LOCAL;
}

const apiUrl = envApiUrl;
const apiUrl3 = envApiUrl3;
const baseUrl = envBaseUrl;
export { apiUrl, apiUrl3, baseUrl };
