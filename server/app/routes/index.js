const noteRoutes = require('./note_routes');
const conversationRoutes = require('./conversation_routes');
const messageRoutes = require('./message_routes');
const userRoutes = require('./user_routes');

module.exports = function(app, db) {
  noteRoutes(app, db);
  conversationRoutes(app, db);
  messageRoutes(app, db);
  userRoutes(app, db);
  // Other route groups could go here, in the future
};