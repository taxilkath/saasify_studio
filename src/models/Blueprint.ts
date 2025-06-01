import mongoose, { Schema, models, model } from 'mongoose';

const BlueprintSchema = new Schema({
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed },
  // Add more fields as needed for your blueprint
}, {
  timestamps: true,
});

export default models.Blueprint || model('Blueprint', BlueprintSchema); 