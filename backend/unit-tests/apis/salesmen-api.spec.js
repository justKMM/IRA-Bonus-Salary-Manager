const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const express = require('express');
const salesmenApi = require('../../src/apis/salesmen-api');
const SalesMenService = require('../../src/services/salesmen-service');

chai.use(chaiHttp);

describe('POST /salesmen/create', function () {
    let app;
    let serviceStub;
    const username = 'admin';
    const password = '5$c3inw%';
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    beforeEach(() => {
        // Set up an Express app with the API route
        app = express();
        app.use(express.json()); // Parse JSON request body
        app.post('/salesmen/create', salesmenApi.createSalesMan);

        // Stub the service method
        serviceStub = sinon.stub(SalesMenService, 'createSalesMan');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 201 and the created salesman on success', async function () {
        const salesmanData = {
            salesmanId: 99999,
            uid: '9ENFSDRCBESBTH2MA4T2TYJFL',
            firstName: 'Fabian',
            middleName: '',
            lastName: 'Thumm',
            bonusSalary: [
                { year: '2024', value: '1' },
                { year: '2023', value: '1000' },
                { year: '2021', value: '234' }
            ],
            jobTitle: 'Senior Salesman',
            employeeId: null,
            department: 'Sales',
            gender: null
        };
    
        const expectedSalesman = { ...salesmanData };
        serviceStub.resolves(expectedSalesman);
    
        const res = await chai.request(app)
            .post('/salesmen/create')
            .set('Authorization', authHeader)
            .send(salesmanData);
    
        // Assertions
        expect(res).to.have.status(201);
        expect(res.body).to.exist;
    
        // Extract bonusSalary for separate comparison
        const { bonusSalary, ...otherFields } = salesmanData;  // Change this line

        expect(res.body).to.include(otherFields);
        expect(res.body.bonusSalary).to.deep.equal(bonusSalary);
        expect(res.body).to.have.property('employeeId', null);
        expect(res.body).to.have.property('gender', null);
        expect(serviceStub.calledOnce).to.be.true;
    });
});
