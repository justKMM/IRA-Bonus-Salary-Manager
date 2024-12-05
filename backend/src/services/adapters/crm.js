const axios = require('axios');
const global_variables = require('../../utils/GLOBAL_VARIABLES.js').default.crm;
const baseUrl = global_variables.baseUrl;

// CRM Config
const credentials = {
    username: global_variables.username,
    password: global_variables.password,
};
const crmConfig = {
    headers: {
        Accept: 'application/json',
    },
    auth: credentials,
};

// Accounts
exports.queryAllAccounts = async () => {
    try {
        return (await axios.get(baseUrl + "/account", crmConfig)).data;
    } catch (error) {
        console.error(`Error queryAllAccounts: ${error.message}`);
    }
};

exports.queryAccountById = async (id) => {
    try {
        return (await axios.get(baseUrl + `/account/${id}`, crmConfig)).data;
    } catch (error) {
        console.error(`Error queryAccountById: ${error.message}`);
    }
};

// Sales orders
exports.queryAllSalesOrders = async () => {
    try {
        return (await axios.get(baseUrl + "/salesOrder", crmConfig)).data;
    } catch (error) {
        console.error(`Error queryAllSalesOrders: ${error.message}`);
    }
};

exports.querySalesOrderById = async (id) => {
    try {
        return (await axios.get(baseUrl + `/salesOrder/${id}`, crmConfig)).data;
    } catch (error) {
        console.error(`Error querySalesOrderById: ${error.message}`);
    }
};

exports.querySalesOrderPosition = async (id) => {
    try {
        return (await axios.get(baseUrl + `/salesOrder/${id}/position`, crmConfig)).data;
    } catch (error) {
        console.error(`Error querySalesOrderPosition: ${error.message}`);
    }
}

/*
exports.addSalesOrder = async () => {
    await axios.post(baseUrl + '/salesOrder', crmConfig);
}*/
