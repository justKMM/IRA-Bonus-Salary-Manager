const sinon = require('sinon');
const chai = require('chai');
const axios = require('axios');
const crm = require('../../src/services/adapters/crm');

const { expect } = chai;

describe('CRM Adapter', () => {
    let axiosStub;

    // Before each test, stub the axios.get method
    beforeEach(() => {
        axiosStub = sinon.stub(axios, 'get');
    });

    // After each test, restore the stubbed axios.get method
    afterEach(() => {
        axiosStub.restore();
    });

    // Test case for when the CRM service is online (reachable)
    describe('Service is online (reachable)', () => {
        it('should return a list of accounts when the CRM is reachable', async () => {
            // Stub the axios.get method to resolve with mock data
            axiosStub.resolves({
                data: { objects: [{ accountId: 1, name: 'Test Account' }] },
            });

            const accounts = await crm.queryAllAccounts();
            expect(accounts).to.be.an('array').that.has.lengthOf(1);
            expect(accounts[0].accountId).to.equal(1);
            expect(accounts[0].name).to.equal('Test Account');
        });

        it('should return a specific account when the CRM is reachable', async () => {
            // Stub the axios.get method to resolve with mock data
            const accountData = { accountId: 1, name: 'Test Account' };
            axiosStub.resolves({ data: accountData });

            const account = await crm.queryAccount('1');
            expect(account).to.be.an('object');
            expect(account.accountId).to.equal(1);
            expect(account.name).to.equal('Test Account');
        });
    });

    // Test case for when the CRM service is offline (not reachable)
    describe('Service is offline (not reachable)', () => {
        it('should throw an error when the CRM is offline', async () => {
            // Stub the axios.get method to reject with a network error
            axiosStub.rejects(new Error('Network Error'));

            try {
                await crm.queryAllAccounts();
                throw new Error('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Network Error');
            }
        });

        it('should throw a connection timeout error when the CRM is offline', async () => {
            // Stub the axios.get method to reject with a timeout error
            axiosStub.rejects({ code: 'ETIMEDOUT', message: 'Connection timed out' });

            try {
                await crm.queryAccount('1');
                throw new Error('Expected timeout error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Connection timed out. Please check your VPN connection.');
            }
        });

        it('should throw an error when a specific sales order is not retrieved due to service being down', async () => {
            // Stub the axios.get method to reject with an error
            axiosStub.rejects(new Error('Service Unavailable'));

            try {
                await crm.querySalesOrderByUid('123');
                throw new Error('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Service Unavailable');
            }
        });
    });
});
