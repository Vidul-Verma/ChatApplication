const mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  onThreadId:{
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  onThreadTitle: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  commentData:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  commentNumber:{
    type: Number,
    default: 0
  },
  creatorId:{
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  creatorName:{
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
     required: true
   }

});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
  Comment
};
