const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const salesmenService = require('../../src/services/salesmen-service');
const Salesman = require('../../src/models/Salesman');
const BonusSalary = require('../../src/models/BonusSalary');

describe('salesmen-service unit-tests', function () {
    describe('createSalesMan', function () {
        let dbMock, collectionMock, insertOneStub;

        beforeEach(() => {
            // Mock the database and collection
            insertOneStub = sinon.stub();
            collectionMock = { insertOne: insertOneStub };
            dbMock = { collection: sinon.stub().returns(collectionMock) };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should create and return a new salesman record', async function () {
            const salesmanData = {
                salesmanId: 99999,
                uid: "9ENFSDRCBESBTH2MA4T2TYJFL",
                firstName: "Fabian",
                middleName: "",
                lastName: "Thumm",
                bonusSalary: [
                    { year: "2024", value: "1" },
                    { year: "2023", value: "1000" },
                    { year: "2021", value: "234" }
                ],
                jobTitle: "Senior Salesman",
                employeeId: null,
                department: "Sales",
                gender: null
            };

            const expectedSalesman = new Salesman(
                salesmanData.salesmanId,
                salesmanData.uid,
                salesmanData.employeeId,
                salesmanData.firstName,
                salesmanData.middleName,
                salesmanData.lastName,
                new BonusSalary(salesmanData.bonusSalary),
                salesmanData.jobTitle,
                salesmanData.department,
                salesmanData.gender
            );

            insertOneStub.resolves({ acknowledged: true });

            const result = await salesmenService.createSalesMan(dbMock, salesmanData);

            // Assertions
            expect(dbMock.collection.calledOnceWith('salesmen')).to.be.true;
            expect(insertOneStub.calledOnceWith(expectedSalesman.toJSON())).to.be.true;
            expect(result).to.be.an.instanceof(Salesman);
            expect(result).to.deep.equal(expectedSalesman);
        });

        it('should throw an error if there is an issue during creation', async function () {
            const salesmanData = {
                salesmanId: 99999,
                uid: "9ENFSDRCBESBTH2MA4T2TYJFL",
                firstName: "Fabian",
                middleName: "",
                lastName: "Thumm",
                bonusSalary: [
                    { year: "2024", value: "1" },
                    { year: "2023", value: "1000" },
                    { year: "2021", value: "234" }
                ],
                jobTitle: "Senior Salesman",
                employeeId: null,
                department: "Sales",
                gender: null
            };

            insertOneStub.rejects(new Error('Database error'));

            try {
                await salesmenService.createSalesMan(dbMock, salesmanData);
                throw new Error('Expected createSalesMan to throw an error');
            } catch (err) {
                expect(err.message).to.equal('Error creating salesman: Database error');
            }
        });
    });
});
