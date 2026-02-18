const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    rolename: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    description: {
      type: String,
      trim: true
    },

    permissions: {
      type: Map,
      of: [{
        type: String,
        enum: ["Read", "Write", "Update", "Delete"]
      }],
      default: {
        products: ["Read"]
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
