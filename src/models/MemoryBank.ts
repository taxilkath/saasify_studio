import mongoose, { Schema, models, model } from 'mongoose';

const MemoryBankSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  content: { type: String, default: '' },
}, {
  timestamps: true,
});

export default models.MemoryBank || model('MemoryBank', MemoryBankSchema);