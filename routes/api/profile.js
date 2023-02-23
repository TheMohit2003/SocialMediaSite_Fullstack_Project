const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validation, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route       GET api/profile/me
// @description Get current users profile
// @access      private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
});

// @route       POST api/profile/me
// @description create or update user profile
// @access      private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.send(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      skills,
      location,
      bio,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route       GET api/profile/
// @description get all public
// @access      public

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.json(500).send('Server error');
  }
});

// @route       POST api/profile/
// @description Get profile by user
// @access      public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(400).json({ msg: 'The profile does not exist' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No such profile exists' });
    }

    res.json(500).send('Server error');
  }
});

// @route       DELETE api/profile/
// @description delete profile user and post
// @access      private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo remove users post
    // remove profile and
    await Profile.findOneAndRemove({
      user: req.user.id,
    });
    await User.findOneAndRemove({
      _id: req.user.id,
    });
    res.json({ msg: 'user removed' });
  } catch (err) {
    console.error(err.message);
    res.json(500).send('Server error');
  }
});

// @route       PUT api/profile/
// @description add profile experience
// @access      private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500);
    }
  }
);

module.exports = router;
