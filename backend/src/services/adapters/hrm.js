const axios = require('axios');
const global_variables = require('../../utils/GLOBAL_VARIABLES.js').hrm;
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
    const response = await axios.post(baseUrl + '/oauth/issueToken',
        authRequestBody,
        {
            headers: {
                Accept: 'application/json',
            }
        });
    return response.data.access_token;
}

// HRM Config
const getHrmConfig = async () => {
    const access_token = await accessToken();
    return {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    }
}

exports.queryAllEmployees = async () => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.get(baseUrl + '/api/v1/employee/search', hrmConfig)).data;
    } catch (error) {
        console.error(`Error queryAllEmployees: ${error.message}`);
    }
};

exports.queryEmployeeById = async (id) => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.get(baseUrl + `/api/v1/employee/${id}`, hrmConfig)).data;
    } catch (error) {
        console.error(`Error queryEmployeeById: ${error.message}`);
    }
};

exports.queryBonusSalariesById = async (id) => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.get(baseUrl + `/api/v1/employee/${id}/bonussalary`, hrmConfig)).data;
    } catch (error) {
        console.error(`Error getBonusSalariesById: ${error.message}`);
    }
}

exports.addBonusSalary = async (id, year, value) => {
    try {
        const hrmConfig = await getHrmConfig();
        return (await axios.post(baseUrl + `/api/v1/employee/${id}/bonussalary`,
            {
                year: year,
                value: value
            }, hrmConfig)).data;
    } catch (error) {
        console.error(`Error addBonusSalary: ${error.message}`);
    }
};
