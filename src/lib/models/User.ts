import mongoose, { Schema, Document } from "mongoose"

export interface IProgress {
  courseId: string
  moduleId: string
  lessonId: string
  completedLessons: string[]
  completedProjects: string[]
  totalProgress: number
}

export interface IUser extends Document {
  id: string
  name?: string
  email: string
  emailVerified?: Date
  password?: string
  image?: string
  githubUsername?: string
  role: "student" | "contributor" | "admin"
  progress: IProgress[]
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  planName: string
  subscriptionStatus?: string
  createdAt: Date
  updatedAt: Date
  archivedAt?: Date
}

const ProgressSchema = new Schema<IProgress>({
  courseId: { type: String, required: true },
  moduleId: { type: String, required: true },
  lessonId: { type: String, required: true },
  completedLessons: [{ type: String }],
  completedProjects: [{ type: String }],
  totalProgress: { type: Number, default: 0 },
})

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    emailVerified: Date,
    password: String,
    image: String,
    githubUsername: String,
    role: { 
      type: String, 
      enum: ["student", "contributor", "admin"], 
      default: "student" 
    },
    progress: [ProgressSchema],
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

// Indexes are automatically created by unique: true in field definitions
UserSchema.index({ role: 1 })
UserSchema.index({ githubUsername: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)