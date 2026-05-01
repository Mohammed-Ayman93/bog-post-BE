const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

const initGridFS = () => {
  mongoose.connection.once("open", () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads", // collection name
    });

    console.log("✅ GridFS initialized");
  });
};

const getBucket = () => {
  if (!bucket) {
    throw new Error("GridFS not initialized");
  }
  return bucket;
};

module.exports = { initGridFS, getBucket };