import mongoose, { Schema, models, model } from 'mongoose';

const KanbanSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  columns: { type: Schema.Types.Mixed },
  tickets: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

export default models.Kanban || model('Kanban', KanbanSchema);