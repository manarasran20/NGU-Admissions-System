const express = require("express");
const documentController = require("../controllers/documentController");
const { validateCreate } = require("../documentValidation");

const router = express.Router();

router.post("/", validateCreate, documentController.create);
router.get("/mine", documentController.listMine);
router.patch("/:id/verify", documentController.verify);

module.exports = router;
