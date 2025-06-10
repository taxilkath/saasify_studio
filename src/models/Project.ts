import mongoose, { Schema, models, model } from 'mongoose';

const ProjectSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  blueprint: { type: Schema.Types.ObjectId, ref: 'Blueprint' },
  
  // --- ADD THESE LINES TO LINK THE NEW MODELS ---
  userFlow: { type: Schema.Types.ObjectId, ref: 'UserFlow' },
  kanban: { type: Schema.Types.ObjectId, ref: 'Kanban' },
  memoryBank: { type: Schema.Types.ObjectId, ref: 'MemoryBank' },

}, {
  timestamps: true,
});

export default models.Project || model('Project', ProjectSchema);