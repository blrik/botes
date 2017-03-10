const path = require('path');
const express = require('express');
const router = express.Router();
const lowdb = require('lowdb');
const storage = require('lowdb/lib/storages/file-sync');
const db = lowdb('db.json', { storage: storage });
db.defaults({ botes: [] }).write();

router.get('/api', function(req, res) {
    res.send(db.get('botes').value());
});

router.post('/api/store', function(req, res) {
    db.get('botes').push(req.body).write();
    res.json({ bote_id: req.body.id, message: 'created', status: true });
});

router.post('/api/update', function(req, res) {
    const bote = { body: req.body.body, last_saved: req.body.last_saved };
    db.get('botes').find({ id: req.body.id }).assign(bote).write();
    res.json({ bote_id: req.body.id, message: 'updated', status: true });
});

router.get('/api/show/:id', function(req, res) {
    const bote_id = parseInt(req.params.id);
    const item = db.get('botes').find({ id: bote_id }).value();
    if (item) {
        res.json({ bote_id: bote_id, bote: item, message: 'read', status: true });
    } else {
        res.json({ bote_id: bote_id, message: 'read', status: false });
    }
});

router.delete('/api/destroy/:id', function(req, res) {
    const bote_id = parseInt(req.params.id);
    db.get('botes').remove({ id: bote_id }).write();
    res.json({ bote_id: bote_id, message: 'destroy', status: true });
});


module.exports = router;