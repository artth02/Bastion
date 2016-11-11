
module.exports = function (app) {
    app.route('/bastion/api/ping').get((req, res) => {
        res.status(200).send(new Date());
    });
}