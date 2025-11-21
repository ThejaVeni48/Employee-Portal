const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/upload");
const { uploadOrgRoles } = require("../../controllers/Roles/uploadRoles");

router.post("/", upload.single("file"), uploadOrgRoles);

module.exports = router;
