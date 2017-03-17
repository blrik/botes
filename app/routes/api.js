var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    app.get('/api', function(req, res) {
        db.collection('botes').find({}).toArray(function(err, result) {
            if (err) {
                res.json({
                    collection: false
                });
            } else {
                res.json({
                    botes: result
                });
            }
        });
    });

    app.post('/api/store', function(req, res) {
        const bote = {
            body: req.body.body,
            last_saved: req.body.last_saved
        };
        db.collection('botes').insert(bote, function(err, result) {
            if (err) {
                res.json({
                    bote: result.ops[0],
                    message: 'created',
                    status: false
                });
            } else {
                res.json({
                    bote: result.ops[0],
                    message: 'created',
                    status: true
                });
            }
        });
    });

    app.put('/api/update/:id', function(req, res) {
        const bote_id = req.params.id;
        const details = {
            '_id': new ObjectID(bote_id)
        };
        const bote = {
            body: req.body.body,
            last_saved: req.body.last_saved
        };
        db.collection('botes').update(details, bote, function(err, result) {
            if (err) {
                res.json({
                    bote_id: bote_id,
                    message: 'updated',
                    status: false
                });
            } else {
                res.json({
                    bote_id: bote_id,
                    message: 'updated',
                    status: true
                });
            }
        });
    });

    app.get('/api/show/:id', function(req, res) {
        const bote_id = req.params.id;
        const details = {
            '_id': new ObjectID(bote_id)
        };
        db.collection('botes').findOne(details, function(err, result) {
            if (err) {
                res.json({
                    bote_id: bote_id,
                    message: 'read',
                    status: false
                });
            } else {
                res.json({
                    bote_id: bote_id,
                    bote: result,
                    message: 'read',
                    status: true
                });
            }
        });
    });

    app.delete('/api/destroy/:id', function(req, res) {
        const bote_id = req.params.id;
        const details = {
            '_id': new ObjectID(bote_id)
        };
        db.collection('botes').remove(details, function(err, result) {
            if (err) {
                res.json({
                    bote_id: bote_id,
                    message: 'destroy',
                    status: false
                })
            } else {
                res.json({
                    bote_id: bote_id,
                    message: 'destroy',
                    status: true
                })
            }
        });
    });
};