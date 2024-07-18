import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/:type', function(req, res, next) {
  const type = req.params.type;
  const list = [
    {
      "_id": 968,
      "title": "fdgdsf",
      "content": "sdf",
      "type": "info",
      "views": 8,
      "user": {
        "_id": 2,
        "name": "네오",
        "profile": "/files/00-sample/user-neo.webp"
      },
      "createdAt": "2024.07.16 18:20:02",
      "updatedAt": "2024.07.16 18:20:02",
      "seller_id": null,
      "repliesCount": 0,
      "product": {
        "image": null
      },
  },
    {
      "_id": 969,
      "title": "test2",
      "content": "sdf",
      "type": "info",
      "views": 8,
      "user": {
        "_id": 2,
        "name": "몰리",
        "profile": "/files/00-sample/user-neo.webp"
      },
      "createdAt": "2024.07.16 18:20:02",
      "updatedAt": "2024.07.16 18:20:02",
      "seller_id": null,
      "repliesCount": 0,
      "product": {
        "image": null
      },
  },
    {
      "_id": 970,
      "title": "test3",
      "content": "sdf",
      "type": "info",
      "views": 8,
      "user": {
        "_id": 2,
        "name": "제이지",
        "profile": "/files/00-sample/user-neo.webp"
      },
      "createdAt": "2024.07.16 18:20:02",
      "updatedAt": "2024.07.16 18:20:02",
      "seller_id": null,
      "repliesCount": 0,
      "product": {
        "image": null
      },
  },
];

  res.render('community/list', { list });
});

export default router;
