const environment = {
    production: false,
    port: 8080,
    defaultAdminPassword: '5$c3inw%',
    url: 'http://localhost',
    db:{
        host: '127.0.0.1',
        port: 27017,
        username: 'admin',
        password: 'admin',
        authSource: 'admin',
        name: 'intArch'
    },
    corsOrigins: [
        'http://localhost:4200'
    ]
};

exports.default = environment;
