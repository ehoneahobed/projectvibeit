import mongoose, { Schema, Document } from "mongoose"

export interface IAccount extends Document {
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
  createdAt: Date
  updatedAt: Date
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
  },
  {
    timestamps: true,
  }
)

// Create compound index for provider and providerAccountId
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })
AccountSchema.index({ userId: 1 })

export const Account = mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema)