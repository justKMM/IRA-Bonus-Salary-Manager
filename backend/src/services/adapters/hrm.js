const axios = require('axios');
const global_variables = require('../../utils/GLOBALS.js').hrm;
const baseUrl = global_variables.baseUrl;

// Bearer authentication
const authRequestBody = {
    client_id: global_variables.clientId,
    client_secret: global_variables.clientSecret,
    grant_type: global_variables.grantType,
    username: global_variables.username,
    password: global_variables.password,
}

const accessToken = async () => {
    try {
        const authRequestBody = new URLSearchParams({
            client_id: 'api_oauth_id',
            client_secret: 'oauth_secret',
            grant_type: 'password',
            username: 'demouser',
            password: '*Safb02da42Demo$',
            // scope: 'admin' // Uncomment if required.
        }).toString();

        const response = await axios.post(
            baseUrl + '/oauth/issueToken',
            authRequestBody,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Cookie: 'Loggedin=True; PHPSESSID=86oc7e0mp9uvasb38lq7t5qvm1'
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        throw error;
    }
};


/**
 * Generates the configuration object required for HRM API requests.
 * 
 * @async
 * @function getHrmConfig
 * @returns {Promise<Object>} Configuration object containing headers with:
 *   - Accept: 'application/json'
 *   - Authorization: Bearer token obtained from the HRM authentication service
 */
const getHrmConfig = async () => {
    const access_token = await accessToken();
    return {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`,
            Cookie: 'Loggedin=True; PHPSESSID=86oc7e0mp9uvasb38lq7t5qvm1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
}

/**
 * Retrieves all employees from the HRM system.
 * 
 * @async
 * @function queryAllEmployees
 * @returns {Promise<Array>} Array of employee objects from the data.data property
 * @throws {Error} Logs error message to console if request fails
 */
exports.queryAllEmployees = async () => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.get(baseUrl + '/api/v1/employee/search', hrmConfig)).data.data;
    } catch (error) {
        console.error(`Error queryAllEmployees: ${error.message}`);
    }
};

/**
 * Retrieves detailed information for a specific employee.
 * 
 * @async
 * @function queryEmployeeById
 * @param {(string|number)} id - The unique identifier of the employee
 * @returns {Promise<Object>} Employee data object
 * @throws {Error} Logs error message to console if request fails
 */
exports.queryEmployeeById = async (id) => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.get(baseUrl + `/api/v1/employee/${id}`, hrmConfig)).data;
    } catch (error) {
        console.error(`Error queryEmployeeById: ${error.message}`);
    }
};

/**
 * Retrieves bonus salary information for a specific employee.
 * 
 * @async
 * @function queryBonusSalariesById
 * @param {(string|number)} id - The unique identifier of the employee
 * @returns {Promise<Object>} Bonus salary data for the employee
 * @throws {Error} Logs error message to console if request fails
 */
exports.queryBonusSalariesById = async (id) => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.get(baseUrl + `/api/v1/employee/${id}/bonussalary`, hrmConfig)).data;
    } catch (error) {
        console.error(`Error queryEmployeeById: ${error.message}`);
    }
};



/**
 * Adds a new bonus salary record for a specific employee.
 * 
 * @async
 * @function addBonusSalary
 * @param {(string|number)} id - The unique identifier of the employee
 * @param {number} year - The year for which the bonus is being added
 * @param {number} value - The bonus amount to be added
 * @returns {Promise<Object>} The created bonus salary record
 * @throws {Error} Logs error message to console if request fails
 */
exports.addBonusSalary = async (id, year, value) => {
    try {
        // Cast year and value to integers
        const body = {
            year: parseInt(year, 10),
            value: parseInt(value, 10),
        };

        const hrmConfig = await getHrmConfig();
        return (await axios.post(
            `${baseUrl}/api/v1/employee/${id}/bonussalary`,
            body,
            hrmConfig
        )).data;
    } catch (error) {
        console.error(`Error addBonusSalary: ${error.message}`);
    }
};
