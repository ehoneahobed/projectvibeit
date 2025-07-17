import mongoose, { Schema, Document } from "mongoose"

export interface IPasswordResetToken extends Document {
  id: string
  email: string
  token: string
  expires: Date
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  }
)

// Create compound index for email and token
PasswordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true })

export const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema)