

var express = require('express');
var router = express.Router();
var errors = require('../utils/errors');

router.post('/:path', function (req, res, next) {
    const odoo = req.odoo;
    odoo.connect(function (err) {
        if (err) return errors(res, err);

        var path = req.params.path;
        var data = req.body;

        odoo.create(path, data, function (err, id) {
            if (err) return errors(res, err);
            odoo.get(path, id, function (err, data) {
                if (err) return errors(res, err);
                res.json({
                    success: true,
                    data: { id, ...data }
                });
            });
        });
    });
});

module.exports = router;