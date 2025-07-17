import mongoose, { Schema, Document } from "mongoose"

export interface IAuthenticator extends Document {
  credentialID: string
  userId: string
  providerAccountId: string
  credentialPublicKey: string
  counter: number
  credentialDeviceType: string
  credentialBackedUp: boolean
  transports?: string
}

const AuthenticatorSchema = new Schema<IAuthenticator>(
  {
    credentialID: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    credentialPublicKey: { type: String, required: true },
    counter: { type: Number, required: true },
    credentialDeviceType: { type: String, required: true },
    credentialBackedUp: { type: Boolean, required: true },
    transports: String,
  }
)

// Create indexes
AuthenticatorSchema.index({ userId: 1, credentialID: 1 }, { unique: true })
AuthenticatorSchema.index({ credentialID: 1 }, { unique: true })

export const Authenticator = mongoose.models.Authenticator || mongoose.model<IAuthenticator>("Authenticator", AuthenticatorSchema)