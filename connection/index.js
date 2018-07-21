

var Odoo = require('node-odoo');

var odoo = new Odoo({
    host: 'localhost',
    port: 8069,
    database: 'OnnaSoft',
    username: 'admin',
    password: '123456'
});


module.exports = odoo;