const globalVariables = {
    orangehrm: {
        baseUrl: 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php',
        clientId: 'test',
        clientSecret: 'test',
        grantType: 'password',
        username: 'mai123',
        password: '*Safb02da42Demo$'
    },
    opencrx: {
        baseUrl_account: 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard',
        baseUrl_contract: 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/',
        baseUrl_product: 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/',
        username: 'guest',
        password: 'guest'
    },
    odoo: {
        baseUrl: 'https://sepp-odoo.inf.h-brs.de',
        db: 'sepp-odoo',
        username: 'admin@smarthoover.com',
        password: 'myHoovercraftIsFullOfEels',
        apiKey: '63fa0092da20bf88a128b1b9a1f8400b00087553'
    }
}

exports.default = globalVariables;