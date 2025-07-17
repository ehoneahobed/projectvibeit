import mongoose, { Schema, Document } from "mongoose"

export interface ISession extends Document {
  sessionToken: string
  userId: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    sessionToken: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

// Indexes are automatically created by unique: true in field definitions

export const Session = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema)