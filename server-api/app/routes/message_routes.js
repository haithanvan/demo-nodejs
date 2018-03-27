var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/messages/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('messages').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });
  app.post('/messages', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    db.collection('messages').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  app.delete('/messages/:id', (req,res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('messages').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      } 
    })
  })
  app.put('/messages/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection('messages').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      } 
    });
  });
  app.get('/messages', (req, res) => {
    db.collection('messages', function(err, collection) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        collection.find().toArray(function(err, items) {
          console.log(items);
          res.send(items);
      });
      }
    });
  });
};