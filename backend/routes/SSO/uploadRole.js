const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/upload");
const { uploadRoles } = require("../../controllers/SSO/uploadRoles");

router.post("/", upload.single("file"), uploadRoles);

module.exports = router;
