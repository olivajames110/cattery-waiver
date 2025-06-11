// models/Waiver.js
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ["adult", "minor"],
    required: true,
  },
  firstName: String,
  lastName: String,
  fullName: String,
  dateOfBirth: Date,
  age: Number,
  signature: String,
  isSigningAdult: { type: Boolean, default: false },
  signingAdultId: String,
  signingAdultName: String,
  minorsSignedFor: [
    {
      id: String,
      name: String,
    },
  ],
});

const searchIndexesSchema = new mongoose.Schema({
  names: [String],
  firstNames: [String],
  lastNames: [String],
  allParticipants: [
    {
      id: String,
      name: String,
      type: String,
      age: Number,
    },
  ],
});

const waiverSummarySchema = new mongoose.Schema({
  id: String,
  dateSubmitted: String,
  participantNames: String,
  participantCount: Number,
  hasMinors: Boolean,
  signingAdults: [String],
});

const waiverSchema = new mongoose.Schema(
  {
    waiverId: { type: String, unique: true, required: true },
    submissionDate: { type: Date, default: Date.now },
    participationType: String,
    totalParticipants: Number,
    adultCount: Number,
    minorCount: Number,
    participants: [participantSchema],
    searchIndexes: searchIndexesSchema,
    waiverSummary: waiverSummarySchema,
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
waiverSchema.index({ waiverId: 1 });
waiverSchema.index({ "participants.fullName": 1 });
waiverSchema.index({ "participants.lastName": 1 });
waiverSchema.index({ "waiverSummary.dateSubmitted": -1 });
waiverSchema.index({ "searchIndexes.names": 1 });
waiverSchema.index({ "searchIndexes.lastNames": 1 });
