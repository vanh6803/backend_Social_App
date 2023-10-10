const db = require("../config/ConnectDB");

const accountSchema = new db.mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    avatar: { type: String },
    bio: { type: String },
    token: { type: String },
    isVerify: { type: Boolean, default: false },
    confirmationCode: { type: String },
    confirmationExpiration: { type: Date },
    friendRequests: [
      {
        type: db.mongoose.Schema.Types.ObjectId,
        ref: "account",
      },
    ],
    friends: [
      {
        type: db.mongoose.Schema.Types.ObjectId,
        ref: "account",
      },
    ],
    sentFriendRequests: [
      {
        type: db.mongoose.Schema.Types.ObjectId,
        ref: "account",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let account = db.mongoose.model("account", accountSchema);
module.exports = {
  account,
};
