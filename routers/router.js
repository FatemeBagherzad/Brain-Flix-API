const express = require('express');
const controller = require('./../controllers/controllers');
const router = express.Router();

router.param('id', controller.checkID);

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '${__dirname}/../dev-data/public');
  },
  filename: (req, file, cb) => {
    // console.log(file);
    // console.log(req.body);
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router
  .route('/videos')
  .get(controller.getAllVideos)
  .post(upload.single('file'), controller.createVideo);

router
  .route('/videos/:id')
  .get(controller.getVideo)
  .post(controller.postComment)
  .patch(controller.editAndLikeComment)
  .delete(controller.deleteComment);

module.exports = router;
