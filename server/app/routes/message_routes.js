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
    const data = JSON.parse(req.body);
    const note = { 
      content: data.content, 
      conversationId: data.conversationId,
      createdOn: data.createdOn,
      userId: data.userId
    };
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
  app.get('/:id/messages', (req, res) => {
    const details = { 'conversationId': req.params.id };
    db.collection('messages', function(err, collection) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        collection.find(details).toArray(function(err, items) {
          res.send(items);
      });
      }
    });
  });
};