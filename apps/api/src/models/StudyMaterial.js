const mongoose = require("mongoose");

const StudyMaterialSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    subject:      { type: String, required: true },
    examName:     { type: String },
    stream:       { type: String, enum: ["Engineering","Management","Medical","Commerce","Arts","Other"], default: "Other" },
    type:         { type: String, enum: ["Syllabus","Notes","Sample Paper","Previous Year","Ebook","Video Link","Other"], default: "Syllabus" },
    description:  { type: String },
    fileUrl:      { type: String },
    language:     { type: String, default: "English" },
    downloads:    { type: Number, default: 0 },
    isDeleted:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

StudyMaterialSchema.index({ stream: 1, type: 1 });

module.exports = mongoose.model("StudyMaterial", StudyMaterialSchema);
