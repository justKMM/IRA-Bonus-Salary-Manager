const environment = {
    production: true,
    port: 8080,
    defaultAdminPassword: 'c3uz#3zd',
    url: 'http://iar-backend.inf.h-brs.de', // URL of production backend
    db: {
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