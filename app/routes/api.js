var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    app.get('/api', function(req, res) {
        if (req.isUnauthenticated()) {
            return res.json({
                message: 'authorization required',
                status: false
            });
        }
        db.collection('botes').find({
            'user_id': req.user.user_id
        }).toArray(function(err, result) {
            if (err) {
                return res.json({
                    message: 'no data',
                    status: false
                });
            } else {
                res.json({
                    botes: result
                });
            }
        });
    });

    app.post('/api/store', function(req, res) {
        if (req.isUnauthenticated()) {
            return res.json({
                message: 'authorization required',
                status: false
            });
        }
        const bote = {
            user_id: req.user.user_id,
            title: req.body.title,
            body: req.body.body,
            last_saved: req.body.last_saved,
        };
        db.collection('botes').insert(bote, function(err, result) {
            if (err) {
                res.json({
                    message: 'bote not created',
                    status: false
                });
            } else {
                res.json({
                    bote: result.ops[0],
                    message: 'bote created',
                    status: true
                });
            }
        });
    });

    app.post('/api/update/:id', function(req, res) {
        if (req.isUnauthenticated()) {
            return res.json({
                message: 'authorization required',
                status: false
            });
        }
        const bote_id = req.params.id;
        const details = {
            '_id': new ObjectID(bote_id),
            'user_id': req.user.user_id
        };
        const bote = {
            user_id: req.user.user_id,
            title: req.body.title,
            body: req.body.body,
            last_saved: req.body.last_saved,
        };
        db.collection('botes').update(details, bote, function(err, result) {
            if (err) {
                res.json({
                    bote_id: bote_id,
                    message: 'bote not updated',
                    status: false
                });
            } else {
                res.json({
                    bote_id: bote_id,
                    message: 'bote updated',
                    status: true
                });
            }
        });
    });

    app.get('/api/show/:id', function(req, res) {
        if (req.isUnauthenticated()) {
            return res.json({
                message: 'authorization required',
                status: false
            });
        }
        const bote_id = req.params.id;
        const details = {
            '_id': new ObjectID(bote_id),
            'user_id': req.user.user_id
        };
        db.collection('botes').findOne(details, function(err, result) {
            if (err) {
                res.json({
                    bote_id: bote_id,
                    message: 'bote not read',
                    status: false
                });
            } else {
                res.json({
                    bote_id: bote_id,
                    bote: result,
                    message: 'bote read',
                    status: true
                });
            }
        });
    });

    app.delete('/api/destroy/:id', function(req, res) {
        if (req.isUnauthenticated()) {
            return res.json({
                message: 'authorization required',
                status: false
            });
        }
        const bote_id = req.params.id;
        const details = {
            '_id': new ObjectID(bote_id),
            'user_id': req.user.user_id
        };
        db.collection('botes').remove(details, function(err, result) {
            if (err) {
                res.json({
                    bote_id: bote_id,
                    message: 'bote not deleted',
                    status: false
                })
            } else {
                res.json({
                    bote_id: bote_id,
                    message: 'bote deleted',
                    status: true
                })
            }
        });
    });
};