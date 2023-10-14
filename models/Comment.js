const db = require("../config/ConnectDB");

const commentSchema = new db.mongoose.Schema(
  {
    user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "account" },
    posts_id: { type: db.mongoose.Schema.Types.ObjectId, ref: "posts" },
    content: { type: String },
    image: [{ type: String }],
    like: [
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

let comment = db.mongoose.model("comment", commentSchema);
module.exports = {
  comment,
};
