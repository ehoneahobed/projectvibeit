import mongoose, { Schema, Document } from "mongoose"

export interface IReply {
  _id?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  createdAt: Date
  replies?: IReply[] // Nested replies for threading
  parentReplyId?: mongoose.Types.ObjectId // Reference to parent reply
}

export interface IDiscussion extends Document {
  lessonId?: mongoose.Types.ObjectId // Keep for backward compatibility
  virtualLessonId: string // New field for content-based lessons
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
  parentReplyId: { type: Schema.Types.ObjectId, ref: "Reply" }, // Reference to parent reply for threading
  replies: [Schema.Types.Mixed], // Allow nested replies
}, {
  _id: true // Ensure _id is generated for each reply
})

const DiscussionSchema = new Schema<IDiscussion>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: false }, // Keep for backward compatibility
    virtualLessonId: { type: String, required: true }, // New field for content-based lessons
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    replies: [ReplySchema],
    isResolved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

// Add custom validation to ensure either lessonId or virtualLessonId is present
DiscussionSchema.pre('validate', function(next) {
  if (!this.lessonId && !this.virtualLessonId) {
    next(new Error('Either lessonId or virtualLessonId must be provided'))
  }
  next()
})

// Create indexes for better query performance
DiscussionSchema.index({ virtualLessonId: 1, createdAt: -1 })
DiscussionSchema.index({ lessonId: 1, createdAt: -1 })
DiscussionSchema.index({ userId: 1 })
DiscussionSchema.index({ isResolved: 1 })

export const Discussion = mongoose.models.Discussion || mongoose.model<IDiscussion>("Discussion", DiscussionSchema) 