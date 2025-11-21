const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/upload");
const { uploadOrgDesignations } = require("../../controllers/Designations/uploadFile");

router.post("/", upload.single("file"), uploadOrgDesignations);

module.exports = router;
