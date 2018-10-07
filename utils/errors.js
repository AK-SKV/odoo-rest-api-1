

module.exports = function (res, err) {
    res.statusCode = 500;
    res.json({
        success: false,
        error: err.message
    });
    console.log(err);
}