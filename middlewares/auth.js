

var express = require('express');
var router = express.Router();
var errors = require('../utils/errors');
var Odoo = require('node-odoo');
var redis = require('redis');
var uuid = require('uuid');
var config = require('../config');

router.post('/login', function (req, res) {
    var params = {
        ...config,
        username: req.body.username || '',
        password: req.body.password || ''
    };
    var odoo = new Odoo(params);
    odoo.connect(function (err, { db, uid, user_context, company_id }) {
        if (err) return errors(res, err);
        if (!uid) return errors(res, new Error('Fallo'));
        var conn = redis.createClient();
        var session_id = uuid();
        conn.set(session_id, JSON.stringify({
            username: params.username,
            password: params.password,
        }), 'EX', 3600);
        conn.quit();
        res.statusCode = 201;
        res.json({
            success: true,
            session: {
                user_context: user_context,
                uid: uid, db: db,
                company_id: company_id,
                session_id: session_id
            }
        });
    })
});


router.get('/session', function (req, res) {
    var { authorization } = req.headers;
    var conn = redis.createClient();
    conn.get(authorization, function (err, _session) {
        if (!_session) return errors(res, new Error('Fallo'));
        var session = JSON.parse(_session);
        conn.quit();
        var params = {
            ...config,
            username: session.username || '',
            password: session.password || ''
        };
        var odoo = new Odoo(params);
        odoo.connect(function (err, { uid }) {
            if (err) return errors(res, err);
            if (!uid) return errors(res, new Error('Fallo'));
            res.json({
                success: true
            });
        });
    });
});


router.get('/logout', function (req, res) {
    var { authorization } = req.headers;
    var conn = redis.createClient();
    conn.set(authorization, '', 'ex', 1);
    res.json({
        success: true
    });
});



router.use(function (req, res, next) {
    var { authorization = '' } = req.headers;
    var conn = redis.createClient();
    if (!authorization) return errors(res, new Error('Fallo'));

    conn.get(authorization, function (err, _session) {
        if (!_session) return errors(res, new Error('Fallo'));
        var session = JSON.parse(_session);
        conn.quit();
        var params = {
            ...config,
            username: session.username || '',
            password: session.password || ''
        };
        var odoo = new Odoo(params);
        odoo.connect(function (err, { uid }) {
            if (err) return errors(res, err);
            if (!uid) return errors(res, new Error('Fallo'));
            req.odoo = odoo;
            next();
        });
    });
});


module.exports = router;