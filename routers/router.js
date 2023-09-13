const express = require('express');
const controller = require('./../controllers/controllers');
const router = express.Router();

router.param('id', controller.checkID);

router
  .route('/videos')
  .get(controller.getAllVideos)
  .post(controller.checkBody, controller.createVideo);

router
  .route('/videos/:id')
  .get(controller.getVideo)
  .post(controller.postComment)
  .patch(controller.editAndLikeComment)
  .delete(controller.deleteComment);

module.exports = router;
