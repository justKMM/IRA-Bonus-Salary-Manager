const axios = require('axios');
const global_variables = require('../../utils/GLOBAL_VARIABLES.js').default.crm;
const baseUrl = global_variables.baseUrl;

exports.queryAllSalesOrders = await axios.get(baseUrl + "");