const db = require("../config/ConnectDB");

const postsSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    content: { type: String },
    image: { type: String },
    like: [
      {
        type: db.mongoose.Schema.Types.ObjectId,
        ref: "account",
      },
    ],
    comment: [
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

let posts = db.mongoose.model("posts", postsSchema);
module.exports = {
  posts,
};
