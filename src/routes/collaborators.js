const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:wikiId/collaborators/add", collaboratorController.add);
// router.post("/wikis/:wikiId/collaborators/:collaboratorId/remove", collaboratorController.remove);
// router.post("/wikis/:wikiId/collaborators/:userId/remove", collaboratorController.remove);
router.post("/wikis/:wikiId/collaborators/:userId/remove", collaboratorController.remove);

module.exports = router;