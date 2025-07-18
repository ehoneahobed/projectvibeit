import mongoose, { Schema, Document } from "mongoose"

export interface ICourse extends Document {
  title: string
  description: string
  slug: string
  order: number
  isPublished: boolean
  modules: mongoose.Types.ObjectId[]
  estimatedHours: number
  prerequisites: string[]
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: false },
    modules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
    estimatedHours: { type: Number, required: true, default: 0 },
    prerequisites: [{ type: String }],
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
// Note: slug index is automatically created by unique: true in field definition
CourseSchema.index({ order: 1 })
CourseSchema.index({ isPublished: 1 })

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema) 