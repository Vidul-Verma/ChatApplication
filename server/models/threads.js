const mongoose = require('mongoose');

var ThreadsSchema = new mongoose.Schema({
  threadTitle: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  threadTags: [{
    tagName:{
      type: String,
      required: false,
      default: 'unknown'
    }
  }],
  threadData:{
    type: String,
    required: true,
    minlength: 1
  },
  creatorId:{
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  creatorName:{
    type: String,
    unique: true
  },
  category:{
    type: String,
    required:true,
    trim: false
  },
  subcategory:{
    type: String,
    required:true,
    trim: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
     required: true
   },
   commentIds:{
     type: Array,
     default: []
   }

});

var Threads = mongoose.model('Threads', ThreadsSchema);

module.exports = {
  Threads
};
