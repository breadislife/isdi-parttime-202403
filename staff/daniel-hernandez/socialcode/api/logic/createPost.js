import { User, Post } from "../data/index.js";
import { SystemError, MatchError } from "com/errors.js";
import validate from "com/validate.js";

const createPost = (userId, title, image, description) => {
  validate.id(userId, "User ID");
  validate.text(title, "Title", 50);
  validate.url(image, "Image");
  validate.text(description, "Description", 200);

  return (async () => {
    let user;

    try {
      user = await User.findById(userId).lean();
    } catch (error) {
      throw new SystemError(`failed to create post: ${error.message}`);
    }

    if (!user) {
      throw new MatchError("user not found");
    }

    const post = {
      author: userId,
      title,
      image,
      description,
      date: new Date(),
      likes: [],
    };

    try {
      await Post.create(post);
    } catch (error) {
      throw new SystemError(`failed to create post: ${error.message}`);
    }
  })();

  /* return User
    .findById(userId)
    .lean()
    .then((user) => {
      if (!user) {
        throw new MatchError("user not found");
      }

      const post = {
        author: userId,
        title,
        image,
        description,
        data: new Date(),
      };

      return Post.create(post);
    })
    .catch((error) => {
      if (error instanceof MatchError) {
        throw error;
      } else {
        throw new SystemError(`failed to create post: ${error.message}`);
      }
    }); */
};

export default createPost;
