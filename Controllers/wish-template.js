const WishTemplate = require("../Models/wish-template");
const {
  PartialFieldsError,
  NotFoundError,
  BadRequestError,
} = require("../Errors");
const wishTemplate = require("../Models/wish-template");
const createTemplate = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { title, detail, wishtype } = req.body;
  if (!title || !detail) {
    throw new PartialFieldsError("Received partial body");
  }
  const result = await WishTemplate.create({
    title: title,
    detail: detail,
    wishType: wishtype,
    createdBy: userId,
  });
  res.status(201).json({ result });
};
const getTemplates = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  let result = WishTemplate.find({ createdBy: userId });
  result = await result.sort({ wishType: "asc" });
  let count = await wishTemplate.count({ createdBy: userId });
  res.status(200).json({ templates: result, total: count });
};

const updateTemplate = async (req, res) => {
  let template = null;
  const {
    user: { userId },
  } = req.body;
  const { templateId } = req.params;
  const { title, detail, wishtype } = req.body;
  if ((!title || !detail, !wishtype))
    throw PartialFieldsError("Provide all fields");
  else {
    // template = await WishTemplate.findById(templateId);

    template = await WishTemplate.findOne({
      createdBy: userId,
      _id: templateId,
    });
    if (template === null) throw new NotFoundError("No such template found");
    else {
      template.title = title;
      template.detail = detail;
      template.wishType = wishtype;
      template = await template.save();
    }
  }
  res.status(200).json({ template: template });
};

const deleteTemplate = async (req, res) => {
  let template = null;
  const {
    user: { userId },
  } = req.body;
  const { templateId } = req.params;
  if (!templateId) new BadRequestError("Provide template ID");
  const count = await WishTemplate.deleteOne({
    createdBy: userId,
    _id: templateId,
  });
  res.status(200).json({ data: count });
};
module.exports = {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
};
