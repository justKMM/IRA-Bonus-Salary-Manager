const crm_adapter = require('./adapters/crm.js');
const Salesman = require('../models/Salesman.js');

const mapOdooEmployee = (odooEmployeeRecord) => {
    const salesmanId = odooEmployeeRecord.identification_id || null;
    const uid = null
    const employeeId = 'ODO-0' + odooEmployeeRecord.id;

    // Extract name from display_name
    const fullName = odooEmployeeRecord.name || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');
    
    const department = odooEmployeeRecord.department_id ? odooEmployeeRecord.department_id[1] : null;
    const jobTitle = (odooEmployeeRecord.job_title === 'Senior Salesperson') ? 'Senior Salesman' : odooEmployeeRecord.jobTitle;
    const sourceSystem = 'odoo';

    return new Salesman(salesmanId, uid, employeeId, firstName, '', lastName, 0, jobTitle, department, null);
};

const mapOrangeHrmEmployee = async (orangeEmployeeRecord) => {
    const salesmanId = orangeEmployeeRecord.code;
    let uid = null;
    const employeeId = 'ORA-0' + orangeEmployeeRecord.employeeId;

    const firstName = orangeEmployeeRecord.firstName;
    const lastName = orangeEmployeeRecord.lastName;
    const department = orangeEmployeeRecord.department;
    const jobTitle =  orangeEmployeeRecord.jobTitle;
    const sourceSystem = 'orangehrm';
    
    if (code) {
        uid = await crm_adapter.querySalesman(salesmanId);
    }

    return new Salesman(salesmanId, uid, employeeId, firstName, '', lastName, 0, jobTitle, department, null);
};

exports.mergeEmployeeRecords = async (odooEmployees, orangeEmployees) => {
    return [
        ...(await Promise.all(odooEmployees.map(employee => mapOdooEmployee(employee)))),
        ...(await Promise.all(orangeEmployees.map(employee => mapOrangeHrmEmployee(employee))))
    ];
};