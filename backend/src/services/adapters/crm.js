const axios = require('axios');
const global_variables = require('../../utils/GLOBALS.js').crm;
const baseUrl_account = global_variables.baseUrl_account;
const baseUrl_contract = global_variables.baseUrl_contract;
const baseUrl_product = global_variables.baseUrl_product;

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

/**
 * Retrieves all accounts from the CRM system.  
 * @returns {Promise<Array<Object>|undefined>} An array of account objects if successful.
 */                                        
exports.queryAllAccounts = async () => {
    try {
        return (await axios.get(baseUrl_account + "/account", crmConfig)).data.objects;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }
        console.error(`Error queryAllAccounts: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves a specific account from the CRM system with the given uid.
 * @param {string} uid - The unique identifier of the account to retrieve
 * @returns {Promise<Object|undefined>} The account object if successful.
 */
exports.queryAccount = async (uid) => {
    try {
        return (await axios.get(baseUrl_account + `/account/${uid}`, crmConfig)).data;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }
        console.error(`Error queryAccountById: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves a specific salesman from the CRM system with the given sid.
 * @param {string} salesmanId - The unique identifier of the salesman to retrieve
 * @returns {Promise<Object|undefined>} The salesman object if successful.
 */
exports.querySalesman = async (salesmanId) => {
    try {
        const accounts = await exports.queryAllAccounts();
        const href = accounts.find(account => account.governmentId === salesmanId);
        return href;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }
        console.error(`Error querySalesman: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves all sales orders from the CRM system.
 * @returns {Promise<Array<Object>|undefined>} An array of sales order objects if successful.
 */
exports.queryAllSalesOrders = async () => {
    try {
        return (await axios.get(baseUrl_contract + "/salesOrder", crmConfig)).data.objects;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }
        console.error(`Error queryAllSalesOrders: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves a specific sales order from the CRM system with the given uid.
 * @param {string} uid - The unique identifier of the sales order to retrieve
 * @returns {Promise<Object|undefined>} The sales order object if successful.
 */
exports.querySalesOrderByUid = async (uid) => {
    try {
        return (await axios.get(baseUrl_contract + `/salesOrder/${uid}`, crmConfig)).data;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }       
        console.error(`Error querySalesOrderByUid: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves all positions of a specific sales order from the CRM system with the given uid.
 * @param {string} uid - The unique identifier of the sales order to retrieve
 * @returns {Promise<Object|undefined>} The sales order object if successful.
 */
exports.querySalesOrderPositionByUid = async (uid) => {
    try {
        return (await axios.get(baseUrl_contract + `/salesOrder/${uid}/position`, crmConfig)).data;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }
        console.error(`Error querySalesOrderPositionByUid: ${error.message}`);
        throw error;
    }
};

/**
 * Retrieves a specific product from the CRM system with the given uid.
 * @param {string} uid - The unique identifier of the product to retrieve
 * @returns {Promise<Object|undefined>} The product object if successful.
 */
exports.queryProductByUid = async (uid) => {
    try {
        return (await axios.get(baseUrl_product + `/product/${uid}`, crmConfig)).data;
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            throw new Error('Connection timed out. Please check your VPN connection.');
        }
        console.error(`Error queryProductByUid: ${error.message}`);
        throw error;
    }
};