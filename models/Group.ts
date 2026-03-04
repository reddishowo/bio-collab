import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  code: string;
  members: string[];
  createdAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // Kode unik 6 digit
  members: { type: [String], default: [] }, // Daftar nama anggota
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);