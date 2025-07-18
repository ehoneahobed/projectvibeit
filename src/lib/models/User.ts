import mongoose, { Schema, Document } from "mongoose"

export interface IProgress {
  courseId: string
  moduleId: string
  lessonId: string
  completedLessons: string[]
  completedProjects: string[]
  totalProgress: number
  completedAt?: Date
}

export interface ISocialMedia {
  platform: string
  handle: string
  url?: string
}

export interface IUser extends Document {
  id: string
  name?: string
  username: string
  email: string
  emailVerified?: Date
  password?: string
  image?: string
  bio?: string
  githubUsername?: string
  twitterUsername?: string
  linkedinUsername?: string
  website?: string
  socialMedia: ISocialMedia[]
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
  completedAt: Date,
})

const SocialMediaSchema = new Schema<ISocialMedia>({
  platform: { type: String, required: true, trim: true },
  handle: { type: String, required: true, trim: true },
  url: { type: String, trim: true },
})

const UserSchema = new Schema<IUser>(
  {
    name: String,
    username: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_-]+$/
    },
    email: { type: String, required: true, unique: true },
    emailVerified: Date,
    password: String,
    image: String,
    bio: String,
    githubUsername: String,
    twitterUsername: String,
    linkedinUsername: String,
    website: String,
    socialMedia: [SocialMediaSchema],
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
UserSchema.index({ username: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)