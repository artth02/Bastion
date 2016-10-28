
module.exports = function (app) {
    app.route('/notification/api/v1/ping').get((req, res) => {
        res.status(200).send(new Date());
    });
}