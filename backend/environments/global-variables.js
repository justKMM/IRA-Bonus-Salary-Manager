const globalVariables = {
    hrm: {
        baseUrl: 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php',
        clientId: 'test',
        clientSecret: 'test',
        grantType: 'password',
        username: 'mai123',
        password: '*Safb02da42Demo$'
    },
    crm: {
        baseUrl: 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard',
        username: 'guest',
        password: 'guest'
    },
}

exports.default = globalVariables;