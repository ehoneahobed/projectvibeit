import mongoose, { Schema, Document } from "mongoose"

export interface IModule extends Document {
  title: string
  description: string
  slug: string
  courseId: mongoose.Types.ObjectId
  order: number
  lessons: mongoose.Types.ObjectId[]
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
    estimatedHours: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
ModuleSchema.index({ courseId: 1, order: 1 })
ModuleSchema.index({ slug: 1 })
ModuleSchema.index({ courseId: 1, slug: 1 }, { unique: true })

export const Module = mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema) 