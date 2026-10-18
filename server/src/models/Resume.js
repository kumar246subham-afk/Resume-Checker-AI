const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  bullets: [{ type: String }]
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  institution: { type: String, default: '' },
  location: { type: String, default: '' },
  graduationDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  highlights: [{ type: String }]
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  role: { type: String, default: '' },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  bullets: [{ type: String }]
}, { _id: false });

const CertificationSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' }
}, { _id: false });

const AchievementSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String, default: '' }
}, { _id: false });

const LanguageSchema = new mongoose.Schema({
  language: { type: String, default: '' },
  proficiency: { type: String, default: 'Fluent' }
}, { _id: false });

const CustomSectionSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  heading: { type: String, default: 'Additional Information' },
  items: [{ type: String }]
}, { _id: false });

const ResumeSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'My Professional Resume',
      trim: true
    },
    templateId: {
      type: String,
      enum: ['ats-classic', 'modern-pro', 'minimal-elegant', 'tech-resume', 'executive-profile'],
      default: 'ats-classic'
    },
    jobTarget: {
      type: String,
      default: 'Software Engineer',
      trim: true
    },
    version: {
      type: Number,
      default: 1
    },
    sections: {
      personalInfo: {
        fullName: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        title: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' }
      },
      summary: {
        type: String,
        default: ''
      },
      experience: [ExperienceSchema],
      education: [EducationSchema],
      skills: {
        technical: [{ type: String }],
        soft: [{ type: String }],
        tools: [{ type: String }]
      },
      projects: [ProjectSchema],
      certifications: [CertificationSchema],
      achievements: [AchievementSchema],
      languages: [LanguageSchema],
      customSections: [CustomSectionSchema]
    },
    styling: {
      font: { type: String, default: 'Inter' },
      fontSize: { type: String, default: 'medium' },
      lineSpacing: { type: String, default: 'normal' },
      primaryColor: { type: String, default: '#6D5EF7' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resume', ResumeSchema);
