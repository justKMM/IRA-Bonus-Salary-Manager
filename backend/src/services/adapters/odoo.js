const xmlrpc = require('xmlrpc');
const global_variables = require('../../utils/GLOBAL_VARIABLES.js').erp;
const baseUrl = global_variables.baseUrl;

// Creating clients for the endpoints
const common = xmlrpc.createClient(`${baseUrl}/xmlrpc/2/common`);
const models = xmlrpc.createClient(`${baseUrl}/xmlrpc/2/object`);

// Get authentication UID
const authenticate = () => {
  return new Promise((resolve, reject) => {
      common.methodCall('authenticate', [
          'db_placeholder',
          global_variables.username,
          global_variables.apiKey,
          {}
      ], (error, uid) => {
          if (error) { return reject(error); }
          else resolve(uid);
      });
  });
};