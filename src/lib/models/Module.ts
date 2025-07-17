import mongoose, { Schema, Document } from "mongoose"

export interface IModule extends Document {
  _id: string
  title: string
  description: string
  slug: string
  courseId: string
  order: number
  lessons: string[]
  estimatedHours: number
  createdAt: Date
  updatedAt: Date
}

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, required: true, default: 0 },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    estimatedHours: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// Indexes
ModuleSchema.index({ courseId: 1, order: 1 })
ModuleSchema.index({ courseId: 1, slug: 1 })

export const Module = mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema)