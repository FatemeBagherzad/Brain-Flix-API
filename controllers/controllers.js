const fs = require('fs');
const uniqid = require('uniqid');

// const videosSimplified = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/videos.json`)
// );

const videosDetailed = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/video-details.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`req.params.id is:  ${val}`);
  const video = videosDetailed.find((video) => video.id === val);
  if (!video) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing title or description',
    });
  }
  next();
};

exports.getAllVideos = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json(videosDetailed);
};

exports.getVideo = (req, res) => {
  const id = req.params.id;
  const video = videosDetailed.find((el) => el.id === id);
  res.status(200).json(video);
};

exports.createVideo = (req, res) => {
  const newId = uniqid();
  const newVideo = Object.assign({ id: newId }, req.body);
  videosDetailed.push(newVideo);
  fs.writeFile(
    `${__dirname}/dev-data/data/video-details.json`,
    JSON.stringify(videosDetailed),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          video: newVideo,
        },
      });
    }
  );
};

exports.postComment = (req, res) => {
  const newId = uniqid();
  const newComment = Object.assign({ id: newId }, req.body);
  const videoId = req.params.id;
  const video = videosDetailed.find((el) => el.id === videoId);
  video.comments.push(newComment);
  fs.writeFile(
    `${__dirname}/../dev-data/data/video-details.json`,
    JSON.stringify(videosDetailed),
    (err) => {
      res.status(201).json(video);
    }
  );
};

exports.editAndLikeComment = (req, res) => {
  const videoId = req.params.id;
  const video = videosDetailed.find((el) => el.id === videoId);
  const comment = video.comments.find((c) => c.id === req.body.data.id);
  Object.assign(comment, req.body.data);
  fs.writeFile(
    `${__dirname}/../dev-data/data/video-details.json`,
    JSON.stringify(videosDetailed),
    (err) => {
      res.status(201).json(video);
    }
  );
};

exports.deleteComment = (req, res) => {
  const { idToDelete } = req.body;
  const videoId = req.params.id;
  const video = videosDetailed.find((el) => el.id === videoId);
  const comment = video.comments.find((c) => c.id === idToDelete);
  const commentIndex = video.comments.indexOf(comment);
  console.log(commentIndex);
  video.comments.splice(commentIndex, 1);
  fs.writeFile(
    `${__dirname}/../dev-data/data/video-details.json`,
    JSON.stringify(videosDetailed),
    (err) => {
      res.status(201).json(video);
    }
  );
};
