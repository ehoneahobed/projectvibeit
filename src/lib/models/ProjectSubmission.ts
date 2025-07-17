import mongoose, { Schema, Document } from "mongoose"

export interface IProjectSubmission extends Document {
  userId: mongoose.Types.ObjectId
  lessonId: mongoose.Types.ObjectId
  submissionUrl: string
  submissionType: "github" | "url" | "text"
  submissionData: string // JSON string for additional data
  status: "submitted" | "reviewed" | "completed"
  feedback?: string
  createdAt: Date
  updatedAt: Date
}

const ProjectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    submissionUrl: { type: String, required: true },
    submissionType: { 
      type: String, 
      required: true, 
      enum: ["github", "url", "text"] 
    },
    submissionData: { type: String, default: "{}" },
    status: { 
      type: String, 
      required: true, 
      enum: ["submitted", "reviewed", "completed"],
      default: "submitted"
    },
    feedback: String,
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
ProjectSubmissionSchema.index({ userId: 1, lessonId: 1 }, { unique: true })
ProjectSubmissionSchema.index({ lessonId: 1 })
ProjectSubmissionSchema.index({ status: 1 })
ProjectSubmissionSchema.index({ createdAt: -1 })

export const ProjectSubmission = mongoose.models.ProjectSubmission || mongoose.model<IProjectSubmission>("ProjectSubmission", ProjectSubmissionSchema) 