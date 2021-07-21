import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hasThread: { type: Boolean, required: true, default: false },
  isAllowed: { type: Boolean, required: true, default: true },
});

export default mongoose.model('Subject', SubjectSchema);
