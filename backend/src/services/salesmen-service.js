class SalesmenService {
    // Hard-coded data
    salesMen = [
        {
            sid: "3",
            firstName: "Sascha",
            lastName: "Alda",
            socialPerformanceRecords: [
                {
                    year: "2020",
                    performance: "good"
                },
                {
                    year: "2021",
                    performance: "very good"
                }
            ]
        }
    ];
    // C - Create
    async createSalesMan(salesMan) {
        // Logic to insert a SalesMan document in the MongoDB collection
        this.salesMen.push(salesMan);
    }

    async createSocialPerformanceRecord(performanceRecord, salesMan) {
        // ...
    }

    // R - Read
    async readSalesMan(sid) {
        return this.salesMen.find(salesMan => salesMan.sid === sid);
    }

    async readAllSalesMen() {
        return this.salesMen;
    }

    async readSocialPerformanceRecord(sid) {
        const salesMan = await this.readSalesMan(sid);
        return salesMan.socialPerformanceRecords;
    }

    async readSocialPerformanceRecordByYear(sid, year) {
        const salesMan = await this.readSalesMan(sid);
        return salesMan.socialPerformanceRecords.find(socialPerformanceRecord => socialPerformanceRecord.year === year);
    }

    // U - Update
    async updateSalesMan(sid, salesMan) {
        await this.deleteSalesMan(sid);
        await this.createSalesMan(salesMan);
    }

    // D - Delete
    async deleteSalesMan(sid) {
        const salesManIndex = this.salesMen.findIndex(salesMan => salesMan.sid === sid);
        this.salesMen.splice(salesManIndex, 1);
    }

    async deleteSocialPerformanceRecord(sid, year) {
        const salesman = this.salesMen.find(s => s.sid === sid);

        if (salesman) {
            // Find the index of the social performance record for the specified year
            const recordIndex = salesman.socialPerformanceRecords.findIndex(record => record.year === year);

            // If a matching record is found, remove it from the array
            if (recordIndex !== -1) {
                salesman.socialPerformanceRecords.splice(recordIndex, 1);
                console.log(`Record for the year ${year} deleted successfully.`);
            } else {
                console.log(`No record found for the year ${year}.`);
            }
        } else {
            console.log(`No salesman found with sid ${sid}.`);
        }
        console.log(this.salesMen);
    }

    async deleteAllSocialPerformanceRecords(sid) {
        // ...
    }
}

module.exports = SalesmenService;
