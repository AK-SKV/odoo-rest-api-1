

var express = require('express');
var router = express.Router();
var errors = require('../utils/errors');

router.patch('/:path/:id', function (req, res, next) {
    const odoo = req.odoo;
    odoo.connect(function (err) {
        if (err) return errors(res, err);

        var id = parseInt(req.params.id);
        var path = req.params.path;
        var data = req.body;

        odoo.update(path, id, data, function (err) {
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