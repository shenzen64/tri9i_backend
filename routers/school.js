const express = require("express");
const router = express.Router();
const School = require("../models/ecole");
// const requireLogin = require("../middlewar/requireLogin");

router.get("/allSchools", async (req, res) => {
  try {
    const schools = await School.find({})
    res.send(schools);
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.get("/school/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
    res.send(school);
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.post("/createSchool", async (req, res) => {
  try {
    const school = new School({
      ...req.body
    });
    await school.save();
    res.send(school);
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.get("/searchSchool/:name", async (req, res) => {
  try {
    let userPattern = new RegExp("" + req.params.name, "i");
    const trajets = await School.find({ $or:[ {surnom: { $regex: userPattern }} ,{nom: { $regex: userPattern }}] }).select(
      "_id surnom nom coordinate"
    );
    res.send(trajets);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// router.get("/allposts", requireLogin, async (req, res) => {
//   try {
//     const posts = await Post.find({})
//       .populate("postedBy", "_id name avatar")
//       .populate("comments.postedBy", "_id name")
//       .sort("-createdAt");

//     res.send(posts);
//   } catch (error) {
//     res.send(404).json({
//       error: "Unable to found posts",
//     });
//   }
// });

// router.get("/myposts", requireLogin, async (req, res) => {
//   try {
//     const posts = await Post.find({
//       postedBy: req.user._id,
//     }).populate("postedBy", "_id name");

//     res.send(posts);
//   } catch (error) {
//     res.send(404).json({
//       error: "Unable to found posts",
//     });
//   }
// });
// router.get("/post/:id", requireLogin, async (req, res) => {
//   try {
//     const trajet = await Post.findOne({
//       _id: req.params.id,
//     })
//       .populate("postedBy", "_id name avatar")
//       .populate("comments.postedBy", "name");

//     res.send(post);
//   } catch (error) {
//     res.send(404).json({
//       error: "Unable to found post",
//     });
//   }
// });

// router.put("/post/like", requireLogin, async (req, res) => {
//   try {
//     const { postId } = req.body;

//     const trajet = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $addToSet: {
//           likes: req.user._id,
//         },
//       },
//       {
//         new: true,
//       }
//     );
//     res.send(post);
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//   }
// });
// router.put("/post/unlike", requireLogin, async (req, res) => {
//   try {
//     const { postId } = req.body;

//     const trajet = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $pull: {
//           likes: req.user._id,
//         },
//       },
//       {
//         new: true,
//       }
//     );
//     res.send(post);
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//   }
// });

// router.put("/post/comment", requireLogin, async (req, res) => {
//   try {
//     const { postId, comment } = req.body;

//     const trajet = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $push: {
//           comments: {
//             text: comment,
//             postedBy: req.user._id,
//           },
//         },
//       },
//       {
//         new: true,
//       }
//     );
//     await post.populate("comments.postedBy", "_id name").execPopulate();
//     res.send(post);
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/posts/following", requireLogin, async (req, res) => {
//   try {
//     const posts = await Post.find({ postedBy: { $in: req.user.following } })
//       .populate("postedBy", "name _id avatar")
//       .populate("comments.postedBy", "_id name")
//       .sort("-createdAt");
//     res.send(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//   }
// });

module.exports = router;
