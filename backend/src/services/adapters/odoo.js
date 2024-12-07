const xmlrpc = require('xmlrpc');
const {response} = require("express");
const global_variables = require('../../utils/GLOBAL_VARIABLES.js').erp;
const baseUrl = global_variables.baseUrl;
let currentUid = false;

// Creating clients for the endpoints
const common = xmlrpc.createSecureClient(`${baseUrl}/xmlrpc/2/common`);
const models = xmlrpc.createSecureClient(`${baseUrl}/xmlrpc/2/object`);  // Changed to regular client

// Get authentication UID
const authenticate = async () => {
    return new Promise((resolve, reject) => {
        // Authentication
        common.methodCall('authenticate', [
            global_variables.db,
            global_variables.username,
            global_variables.password,
            {}
        ], (error, uid) => {
            if (error) {
                console.error('Authentication error:', error);
                return reject(error);
            }
            if (!uid) {
                console.error('Authentication failed: No UID returned');
                return reject(new Error('Authentication failed'));
            }
            console.log('Authentication successful. UID:', uid);
            currentUid = uid;  // Set the currentUid
            resolve(uid);
        });
    });
};

/**
 * Retrieves all employees from Odoo
 * @param {Array} fields - Optional array of field names to retrieve (defaults to all fields)
 * @returns {Promise<Array>} Array of employee records
 */
exports.getAllEmployees = async (fields = []) => {
    try {
        // Authenticate
        if (!currentUid) {
            await authenticate();
        }
        // Query employees
        return new Promise((resolve, reject) => {
            const params = [
                global_variables.db,
                currentUid,
                global_variables.password,
                'hr.employee',
                'search_read',
                [[]],                     // domain (empty array means no filters)
                fields                    // fields to fetch
            ];

            models.methodCall('execute_kw', params, (error, employees) => {
                if (error) {
                    console.error('Error fetching employees:', error);
                    reject(error);
                } else {
                    console.log(`Successfully retrieved ${employees?.length || 0} employees`);
                    resolve(employees);
                }
            });
        });
    } catch (error) {
        console.error('Error in getAllEmployees:', error);
        throw error;
    }
};