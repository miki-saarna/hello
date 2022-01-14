const service = require('./theaters.service.js');
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const data = await service(req.app.get('db')).list();
    res.json({ data })
}

module.exports = {
    list: [asyncErrorBoundary(list)],
}