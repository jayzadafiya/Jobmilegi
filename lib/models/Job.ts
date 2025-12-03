import mongoose, { Document, Schema, Model } from "mongoose";

export interface IJob extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription: string;
  descriptionHtml: string;
  tags: string[];
  category: string;
  jobType: string;
  publishDate: Date;
  expiryDate: Date;
  location: string;
  imageUrl?: string;
  youtubeUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    descriptionHtml: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "railway",
        "ssc",
        "bank",
        "police",
        "stateGovt",
        "defenseJobs",
        "teachingJobs",
        "engineeringJobs",
        "other",
      ],
    },
    jobType: {
      type: String,
      required: true,
      enum: [
        "latest",
        "admitCard",
        "result",
        "answerKey",
        "notification",
        "exam",
        "recruitment",
      ],
    },
    publishDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
JobSchema.index({ slug: 1 });
JobSchema.index({ category: 1, isPublished: 1 });
JobSchema.index({ jobType: 1, isPublished: 1 });
JobSchema.index({ publishDate: -1 });
JobSchema.index({ views: -1 });
JobSchema.index({ expiryDate: 1 });

// Virtual for formatted dates
JobSchema.virtual("formattedPublishDate").get(function () {
  return this.publishDate.toLocaleDateString("en-IN");
});

JobSchema.virtual("formattedExpiryDate").get(function () {
  return this.expiryDate.toLocaleDateString("en-IN");
});

// Pre-save middleware to generate slug
JobSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
