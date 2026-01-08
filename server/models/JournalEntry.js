// import mongoose from "mongoose";

// const journalEntrySchema = new mongoose.Schema({
//   // 🔗 Which user wrote this journal
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },

//   // 📝 User's written journal text
//   entryText: { 
//     type: String, 
//     required: [true, "Journal entry cannot be empty"], 
//     trim: true 
//   },

//   // 😊 Mood selection (optional, chosen by user)
//   mood: { 
//     type: String, 
//     enum: ["happy", "sad", "angry", "stressed", "neutral"], 
//     default: "neutral" 
//   },

//   // 🧠 AI-generated analysis or summary of the entry
//   aiSummary: { 
//     type: String, 
//     default: "" 
//   },

//   // 💡 AI suggestions for self-improvement or mindfulness
//   aiSuggestions: { 
//     type: [String], 
//     default: [] 
//   },

//   // 🔍 Sentiment score (e.g., from -1 to +1)
//   sentimentScore: { 
//     type: Number, 
//     min: -1, 
//     max: 1 
//   },

//   // 📅 Date for filtering journals by day
//   date: { 
//     type: Date, 
//     default: Date.now 
//   }

// }, { timestamps: true }); // adds createdAt and updatedAt

// export default mongoose.model("JournalEntry", journalEntrySchema);




import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  // 🔗 User reference
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // 📝 Journal text
  entryText: { 
    type: String, 
    required: [true, "Journal entry cannot be empty"], 
    trim: true 
  },

  // 😊 User-selected mood
  mood: { 
    type: String, 
    enum: ["happy", "sad", "angry", "stressed", "neutral"], 
    default: "neutral" 
  },

  // 🧠 AI summary
  aiSummary: { 
    type: String, 
    default: "" 
  },

  // 💡 Rule-based + AI suggestions
  aiSuggestions: { 
    type: [String], 
    default: [] 
  },

  // 🔍 AI sentiment score
  sentimentScore: { 
    type: Number, 
    min: -1, 
    max: 1 
  },

  // 🔖 Derived label (IMPORTANT for logic)
  sentimentLabel: {
    type: String,
    enum: ["positive", "neutral", "negative"],
    default: "neutral"
  },

  // 🤖 Privacy control (for later steps)
  aiEnabled: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("JournalEntry", journalEntrySchema);
