import logic from "../../logic/index.js";
import jwt from "../../util/jsonwebtoken-promisified.js";
const { JWT_SECRET } = process.env;

const deletePost = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { sub: userId } = await jwt.verify(token, JWT_SECRET, {});
    const { postId } = req.params;

    await logic.deletePost(userId, postId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default deletePost;