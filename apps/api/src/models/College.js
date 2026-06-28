const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const CollegeSchema = new mongoose.Schema(
  {
    collegeName:          { type: String, required: true },
    slug:                 { type: String, index: true },
    shortName:            { type: String },
    shortCode:            { type: String },
    logo:                 { type: String },
    bannerImage:          { type: String },
    image:                { type: String },
    brochureUrl:          { type: String },
    location:             { type: String },
    state:                { type: String },
    city:                 { type: String },
    establishedYear:      { type: Number },
    collegeType:          { type: String, default: "Private" },
    affiliation:          { type: String },
    accreditation:        { type: String },
    ranking:              { type: Number, default: 10 },
    rank:                 { type: Number, default: 10 },
    rating:               { type: Number, default: 4.5 },
    userReviews:          { type: String, default: "4.5/5" },
    fees:                 { type: Number, default: 150000 },
    feesAmount:           { type: String },
    feeDescription:       { type: String },
    highestPackage:       { type: String },
    averagePackage:       { type: String },
    hostelAvailability:   { type: String, default: "Available" },
    scholarshipAvailable: { type: String, default: "Available" },
    scholarship:          { type: String, default: "Available" },
    cutoffExam:           { type: String, default: "JEE Main" },
    qualifyingExam:       { type: String },
    cutoffScore:          { type: String, default: "JEE Main Rank ~ 5,15,000" },
    category:             { type: String, default: "Private" },
    bestFor:              { type: String },
    applicationStart:     { type: Date },
    applicationEnd:       { type: Date },
    applicationStartDate: { type: Date },
    applicationEndDate:   { type: Date },
    status:               { type: String, enum: ["Active", "Inactive", "Draft"], default: "Active" },
    courses:              [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    sections: {
      about: String,
      coursesFees: String,
      admissionProcess: String,
      eligibility: String,
      cutoff: String,
      placements: String,
      hostel: String,
      reviews: String,
      scholarships: String,
      faqs: String
    },
    infoDescription: String,
    coursesFeesDescription: String,
    admissionDescription: String,
    cutoffDescription: String,
    placementDescription: String,
    seo: {
      title: String,
      description: String
    },
    metaTitle: String,
    metaDescription: String,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

CollegeSchema.pre("validate", function (next) {
  if (!this.slug && this.collegeName) {
    this.slug = slugify(this.collegeName);
  }
  next();
});

module.exports = mongoose.model("College", CollegeSchema);
