const express = require("express");
const { route } = require("express/lib/application");
const { redirect } = require("express/lib/response");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");
const sharp = require("sharp");

//create user
router.post("/create", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    if (!user) {
      res.send("Invalid email or password");
    } else {
      res.send({ user, token });
    }
  } catch (e) {
    res.status(400).send({ error: "errror" });
  }
});

//logout
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//logoutAll
router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//read users
router.get("/list", auth, async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).send();
    }

    res.send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

//user/me
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

//update user
router.patch("/update/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//delete user

router.delete("/delete/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err.message || err);
  }
});

//upload avatar
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Upload file is not a valid file name"));
    } else {
      cb(undefined, true);
    }
  },
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ with: 500, height: 500 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(req.user);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//delete avatar

router.delete("/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//view avatar
router.get("/:id/avatar", async (req, res) => {
  const user = await User.findById(req.params.id);
  // if (!user || user.avatar) {
  //   throw new Error();
  // }

  res.set("Content-Type", "image/jpg");
  res.send(user.avatar);
});
module.exports = router;
