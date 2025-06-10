import mongoose, { Schema, models, model } from 'mongoose';

const UserFlowSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  nodes: { type: Schema.Types.Mixed },
  edges: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

export default models.UserFlow || model('UserFlow', UserFlowSchema);