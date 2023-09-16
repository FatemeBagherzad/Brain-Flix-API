const fs = require('fs');
const uniqid = require('uniqid');
const path = require('path');

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
  console.log(req.body);
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
  console.log(req.file);
  const newId = uniqid();
  const uploadVideo = {
    id: newId,
    title: req.body.title,
    channel: req.body.channel,
    image: `http://localhost:8888/${req.file.filename}`,
    description: req.body.description,
    views: 0,
    likes: 0,
    duration: '4:20',
    videoUrl: 'https://project-2-api.herokuapp.com/stream',
    timestamp: 0,
    comments: [],
  };
  videosDetailed.push(uploadVideo);
  fs.writeFile(
    `${__dirname}/../dev-data/data/video-details.json`,
    JSON.stringify(videosDetailed),
    (err) => {
      res.status(201).json(uploadVideo);
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
