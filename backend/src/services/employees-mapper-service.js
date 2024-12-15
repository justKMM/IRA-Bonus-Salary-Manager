const crm_adapter = require('./adapters/crm.js');

class EmployeeMapper{
    constructor() {
        this.standardFields = {
            sid: null,
            code: null,
            firstName: null,
            lastName: null,
            fullName: null,
            jobTitle: null,
            unit: null,
            sourceSystem: null,
            openCrxId: '',
        };
    }
}

const mapOdooEmployee = (odooEmployeeRecord) => {
    const mappedRecord = { ...this.standardFields };
    const jobTitle = (odooEmployeeRecord.job_title === 'Senior Salesperson') ? 'Senior Salesman' : odooEmployeeRecord.jobTitle;
    // Extract name from display_name
    const fullName = odooEmployeeRecord.name || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');

    mappedRecord.sid = 'ODO-0' + odooEmployeeRecord.id;
    mappedRecord.code = odooEmployeeRecord.identification_id || null;
    mappedRecord.firstName = firstName;
    mappedRecord.lastName = lastName;
    mappedRecord.fullName = fullName;
    mappedRecord.unit = odooEmployeeRecord.department_id ? odooEmployeeRecord.department_id[1] : null;
    mappedRecord.jobTitle = jobTitle || null;
    mappedRecord.sourceSystem = 'odoo';
    mappedRecord.openCrxId = null

    return mappedRecord;
};

const mapOrangeHrmEmployee = async (orangeEmployeeRecord) => {
    const mappedRecord = { ...this.standardFields };

    mappedRecord.sid = 'ORA-0' + orangeEmployeeRecord.employeeId;
    mappedRecord.code = orangeEmployeeRecord.code;
    mappedRecord.firstName = orangeEmployeeRecord.firstName;
    mappedRecord.lastName = orangeEmployeeRecord.lastName;
    mappedRecord.fullName = `${orangeEmployeeRecord.firstName} ${orangeEmployeeRecord.lastName}`;
    mappedRecord.unit = orangeEmployeeRecord.unit;
    mappedRecord.jobTitle =  orangeEmployeeRecord.jobTitle;
    mappedRecord.sourceSystem = 'orangehrm';
    mappedRecord.openCrxId = null;

    if (mappedRecord.code) {
        mappedRecord.openCrxId = await crm_adapter.queryAccountIdByGovernmentId(90123);
    }
    console.log(mappedRecord.firstName + ' '+ mappedRecord.lastName);
    return mappedRecord;
};

exports.mergeEmployeeRecords = async (odooEmployees, orangeEmployees) => {
    return [
        ...(await Promise.all(odooEmployees.map(employee => mapOdooEmployee(employee)))),
        ...(await Promise.all(orangeEmployees.map(employee => mapOrangeHrmEmployee(employee))))
    ];
};