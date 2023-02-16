const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
} = require("../Controllers/wish-template");
router.route("/template").post(createTemplate).get(getTemplates);
router
  .route("/template/:templateId")
  .patch(updateTemplate)
  .delete(deleteTemplate);
module.exports = router;
