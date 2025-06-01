import mongoose, { Schema, models, model } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  blueprint: { type: Schema.Types.ObjectId, ref: 'Blueprint' },
}, {
  timestamps: true,
});

export default models.Project || model('Project', ProjectSchema); 