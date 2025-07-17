import mongoose, { Schema, Document } from "mongoose"

export interface IVerificationToken extends Document {
  identifier: string
  token: string
  expires: Date
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    identifier: { type: String, required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  }
)

// Create compound index for identifier and token
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true })

export const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema)