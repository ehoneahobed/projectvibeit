import mongoose, { Schema, Document } from "mongoose"

export interface IReply {
  userId: mongoose.Types.ObjectId
  content: string
  createdAt: Date
}

export interface IDiscussion extends Document {
  lessonId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  replies: IReply[]
  isResolved: boolean
  createdAt: Date
  updatedAt: Date
}

const ReplySchema = new Schema<IReply>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const DiscussionSchema = new Schema<IDiscussion>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    replies: [ReplySchema],
    isResolved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
DiscussionSchema.index({ lessonId: 1, createdAt: -1 })
DiscussionSchema.index({ userId: 1 })
DiscussionSchema.index({ isResolved: 1 })

export const Discussion = mongoose.models.Discussion || mongoose.model<IDiscussion>("Discussion", DiscussionSchema) 