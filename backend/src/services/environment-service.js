let environment;
if(process.env.NODE_ENV === 'development'){
    environment = require('../../environments/environment.js').default;
} else{
    environment = require('../../environments/environment.prod.js').default;
}