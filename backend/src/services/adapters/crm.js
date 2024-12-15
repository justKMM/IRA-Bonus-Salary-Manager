const axios = require('axios');
const global_variables = require('../../utils/GLOBALS.js').crm;
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
        return (await axios.get(baseUrl + "/account", crmConfig)).data.objects;
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

exports.queryAccountIdByGovernmentId = async (government_id) => {
    try {
        const accounts = await exports.queryAllAccounts();
        const href = accounts.find(account => account.governmentId === government_id)?.['@href'];
        return extractAccountIdFromUrl(href);
    } catch (error) {
        console.error(`Error queryAccountByGovernmentId: ${error.message}`);
    }
}
// Sales orders
exports.queryAllSalesOrders = async () => {
    try {
        return (await axios.get(baseUrl + "/salesOrder", crmConfig)).data.objects;
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

// Helper methods
const extractAccountIdFromUrl = (url) => {
    const match = url.match(/\/account\/([A-Z0-9]+)\/?$/);
    if (!match) throw new Error('No valid ID found in URL');
    return match[1];
};