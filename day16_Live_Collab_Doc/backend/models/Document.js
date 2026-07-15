const { Schema, model } = require('mongoose');

const DocumentSchema = new Schema({
  _id: String, // We will use a custom string ID so users can share links like /doc/12345
  data: Object // Yjs handles data as complex objects, so we store it as a generic Object
}, { timestamps: true });

module.exports = model('Document', DocumentSchema);