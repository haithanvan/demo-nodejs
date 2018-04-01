var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/conversations/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('conversations').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });
  app.post('/conversations', (req, res) => {
    const data = JSON.parse(req.body);
    const note = { 
      text: data.text, 
      title: data.title,
      modified: data.modified
    };
    console.log(note);
    db.collection('conversations').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  app.delete('/conversations/:id', (req,res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('conversations').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      } 
    })
  })
  app.put('/conversations/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const data = JSON.parse(req.body);
    const note = { 
      text: data.text, 
      title: data.title,
      modified: data.modified
    };
    db.collection('conversations').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      } 
    });
  });
  app.get('/conversations', (req, res) => {
    db.collection('conversations', function(err, collection) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        collection.find().toArray(function(err, items) {
          res.send(items);
      });
      }
    });
  });
};