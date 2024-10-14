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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required.' });
    }

    const newId = uniqid();
    const uploadVideo = {
      id: newId,
      title: req.body.title || 'Untitled Video',
      channel: req.body.channel || 'Unknown Channel',
      image: `http://localhost:8888/${req.file.filename}`,
      description: req.body.description || 'No description provided',
      views: 0,
      likes: 0,
      duration: '4:20', // Placeholder, should be dynamic in real-world apps.
      videoUrl: 'https://project-2-api.herokuapp.com/stream',
      timestamp: Date.now(),
      comments: [],
    };

    videosDetailed.push(uploadVideo);

    const dataPath = path.join(
      __dirname,
      '../dev-data/data/video-details.json'
    );
    fs.writeFile(dataPath, JSON.stringify(videosDetailed, null, 2), (err) => {
      if (err) {
        console.error('Error saving video details:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      res
        .status(201)
        .json({ message: 'Video created successfully.', data: uploadVideo });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
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
