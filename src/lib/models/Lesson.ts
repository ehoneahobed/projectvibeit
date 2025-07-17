import mongoose, { Schema, Document } from "mongoose"

export interface IResource {
  title: string
  url: string
  type: "article" | "video" | "tool" | "documentation"
}

export interface IAssignment {
  title: string
  description: string
  instructions: string
  submissionType: "github" | "url" | "text"
  starterCode?: string
}

export interface ILesson extends Document {
  title: string
  description: string
  slug: string
  moduleId: mongoose.Types.ObjectId
  order: number
  type: "lesson" | "project" | "assignment"
  content: string // Markdown content
  resources: IResource[]
  assignment?: IAssignment
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["article", "video", "tool", "documentation"] 
  },
})

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  submissionType: { 
    type: String, 
    required: true, 
    enum: ["github", "url", "text"] 
  },
  starterCode: String,
})

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    order: { type: Number, required: true, default: 0 },
    type: { 
      type: String, 
      required: true, 
      enum: ["lesson", "project", "assignment"],
      default: "lesson"
    },
    content: { type: String, required: true, default: "" },
    resources: [ResourceSchema],
    assignment: AssignmentSchema,
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
LessonSchema.index({ moduleId: 1, order: 1 })
LessonSchema.index({ slug: 1 })
LessonSchema.index({ moduleId: 1, slug: 1 }, { unique: true })
LessonSchema.index({ type: 1 })
LessonSchema.index({ isPublished: 1 })

export const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema) 