/**
 * Main application entry point
 * 
 * This file sets up and configures an Express.js server with MongoDB integration,
 * API documentation, session management, and graceful shutdown handling.
 * 
 * Key Features:
 * - MongoDB database connection and initialization
 * - Swagger API documentation generation
 * - Session management with secure cookies
 * - CORS configuration
 * - Request body parsing (JSON, URL-encoded, and multipart/form-data)
 * - Graceful shutdown handling
 */

const express = require('express');
const cookieSession = require('cookie-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const multer = require('multer');
const upload = multer();
const app = express();
const crypto = require('crypto');
const cors = require('cors');
const YAML = require('yaml');
const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// Database connection helper
const connectDB = async (credentials, environment) => {
    try {
        const client = await MongoClient.connect(
            `mongodb://${credentials}${environment.db.host}:${environment.db.port}/?authSource=${environment.db.authSource}`
        );
        return client.db(environment.db.name);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

// Load environment configuration
let environment;
if (process.env.NODE_ENV === 'development') {
    environment = require('../environments/environment.js').default;
} else {
    environment = require('../environments/environment.prod.js').default;
}
app.set('environment', environment);

// Middleware setup
app.use(express.json()); // adds support for json encoded bodies
app.use(express.urlencoded({ extended: true })); // adds support url encoded bodies
app.use(upload.array()); // adds support multipart/form-data bodies

// Config for API Doc generator
const swaggerJsDocOptions = {
    explorer: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'REST API Interface',
            version: '1.0.0',
        },
    },
    apis: [__dirname + '/routes/api-routes.js'],
};

const swaggerSpec = {
    ...swaggerJsDoc(swaggerJsDocOptions),
    servers: [{
        url: `http://localhost:${environment.port}`,
        description: `${process.env.NODE_ENV} server`,
    }],
};

// Serving the API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Automated generating .yaml file
const yamlContent = `---
# API Documentation
${YAML.stringify(swaggerSpec)}`;
fs.writeFileSync(__dirname + '/../swagger.yaml', yamlContent);

// Enhanced session configuration
app.use(cookieSession({
    name: 'session',
    secret: crypto.randomBytes(32).toString('hex'),
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
}));

// CORS configuration
app.use(cors({
    origin: environment.corsOrigins,
    credentials: true
}));

// API Routes
const apiRouter = require('./routes/api-routes');
app.use('/api', apiRouter);

// Graceful shutdown handling
const gracefulShutdown = (server, db) => {
    const shutdown = async () => {
        console.log('Shutting down gracefully...');
        server.close(async () => {
            if (db && db.mongoClient) {
                await db.mongoClient.close();
            }
            console.log('Server stopped successfully');
            process.exit(0);
        });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
        if (data.trim().toLowerCase() === 'stop') {
            shutdown();
        }
    });
};

// Database initialization
const initDb = async (db) => {
    try {
        // Explicitly create all collections
        await Promise.all([
            db.createCollection('salesmen'),
            db.createCollection('socialperformance'),
            db.createCollection('salesperformance'),
            db.createCollection('customers'),
            db.createCollection('salesorders'),
            db.createCollection('users')
        ]);

        // Create indexes after ensuring collections exist
        await Promise.all([
            db.collection('salesmen').createIndex({ "salesmanId": 1 }, { unique: true }),
            db.collection('socialperformance').createIndex({ "salesmanId": 1, "socialId": 1, "year": 1 }, { unique: true }),
            db.collection('salesperformance').createIndex({ "salesmanId": 1, "salesId": 1, "year": 1 }, { unique: true }),
            db.collection('customers').createIndex({ "uid": 1 }, { unique: true }),
            db.collection('salesorders').createIndex({ "uid": 1 }, { unique: true }),
            db.collection('users').createIndex({ "username": 1 }, { unique: true })
        ]);

        const userCount = await db.collection('users').countDocuments();
        if (userCount < 1) {
            const userService = require('./services/user-service');
            const User = require("./models/User");
            
            if (!environment.defaultAdminPassword) {
                throw new Error('Default admin password not configured');
            }
            
            await userService.add(db, new User('admin', '', 'admin', '', environment.defaultAdminPassword, true));
            console.log('Created admin user successfully');
        }
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
};

// Main application startup
const startServer = async () => {
    const db_credentials = environment.db.username 
        ? `${environment.db.username}:${environment.db.password}@`
        : '';

    try {
        const db = await connectDB(db_credentials, environment);
        await initDb(db);
        app.set('db', db);

        const server = app.listen(environment.port, () => {
            console.log(`Webserver started on port ${environment.port}`);
        });

        // Move test code here where db is available
        const salesOrders = require('./services/salesorder-service.js');
        const crm = require('./services/adapters/crm.js');
        const salesmen = require('./services/salesmen-service.js');
        const customers = require('./services/customer-service.js');
        const evaluationService = require('./services/evaluation-service.js');

        async function test() {
            try {
                //const querry = await evaluationService.generateEvaluation(db, 90123, '2024');
                //console.log('Querry:', JSON.stringify(querry, null, 2));
                const querry = await salesOrders.getSalesmanOrders(db, 90123, '2018');
                console.log('Querry:', JSON.stringify(querry, null, 2));
            } catch (error) {
                console.error('Test failed:', error);
            }
        }

        // Run the test and update salesmen
        await test();

        // Gets all salesmen and customers from OpenCRX and updates the db
        await salesmen.updateSalesmenFromOpenCRX(db);
        await customers.updateCustomersFromOpenCRX(db);
        await salesOrders.updateSalesOrdersFromOpenCRX(db);
        console.log('Fetched data successfully');

        gracefulShutdown(server, db);
    } catch (err) {
        console.error('Server startup failed:', err);
        process.exit(1);
    }
};

// Start the application
startServer();