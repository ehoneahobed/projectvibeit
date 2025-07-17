import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  id: string
  name?: string
  email: string
  emailVerified?: Date
  password?: string
  image?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  planName: string
  subscriptionStatus?: string
  createdAt: Date
  updatedAt: Date
  archivedAt?: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    emailVerified: Date,
    password: String,
    image: String,
    stripeCustomerId: { type: String, unique: true, sparse: true },
    stripeSubscriptionId: { type: String, unique: true, sparse: true },
    planName: { type: String, default: "free" },
    subscriptionStatus: String,
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Create indexes
UserSchema.index({ email: 1 })
UserSchema.index({ stripeCustomerId: 1 })
UserSchema.index({ stripeSubscriptionId: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)