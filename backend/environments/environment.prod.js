const environment = {
    production: true,
    port: 8080,
    defaultAdminPassword: 'c3uz#3zd',
    db:{
        host: 'iar-mongo.inf.h-brs.de',
        port: 27017,
        username: 'tldr',
        password: 'tldr!',
        authSource: 'tldr',
        name: 'tldr'
    },
    corsOrigins: [
        'http://iar-frontend.inf.h-brs.de'
    ]
};

exports.default = environment;