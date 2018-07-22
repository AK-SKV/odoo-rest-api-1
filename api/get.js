

var express = require('express');
var router = express.Router();
var errors = require('../utils/errors');
var events = require('../events');

router.get('/:path', function (req, res, next) {
    const odoo = req.odoo;
    odoo.connect(function (err) {
        if (err) return errors(res, err);

        var path = req.params.path;
        var search = JSON.parse(req.query.q || '[]');

        odoo.search(path, search, async function (err, data) {
            if (err) return errors(res, err);

            const _data = [];
            Promise.all(data.map((id) => {
                return new Promise((resolve, reject) => {
                    odoo.get(path, id, function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        _data.push(data);
                        resolve();
                    });
                });
            }))
                .then(() => res.json({
                    success: true,
                    data: _data
                }))
                .catch((err) => errors(res, err));
        });
    });
});


router.get('/:path/:id', function (req, res, next) {
    const odoo = req.odoo;
    odoo.connect(function (err) {
        if (err) return errors(res, err);

        var id = parseInt(req.params.id);
        var path = req.params.path;

        odoo.get(path, id, function (err, data) {
            if (err) return errors(res, err);
            res.json({
                success: true,
                data: data
            });
        });
    });
});

module.exports = router;