const data = {};

data.findUser = (username) => {
  const userKey = `user_${username}`.toLowerCase();
  const userKeyString = JSON.stringify(userKey);

  if (localStorage.getItem(userKeyString)) {
    return JSON.parse(localStorage.getItem(userKeyString));
  }
};

data.insertUser = (userData) => {
  // generate user key
  const userKey = `user_${userData.username}`.toLowerCase();
  const userKeyString = JSON.stringify(userKey);

  localStorage.setItem(userKeyString, JSON.stringify(userData));
};

data.findPosts = (callback) => {
  let postsJson = localStorage.posts;

  if (!postsJson) {
    postsJson = "[]";
  }

  const posts = JSON.parse(postsJson);

  const filteredPost = posts.filter(callback);

  return filteredPost;
};

data.insertPost = (post) => {
  let postsJson = localStorage.posts;
  if (!postsJson) {
    postsJson = "[]";
  }

  const posts = JSON.parse(postsJson);

  const postIdGenerator = IdGenerator();
  post.Id = postIdGenerator.generatePostId();
  posts.push(post);

  postsJson = JSON.stringify(posts);

  localStorage.posts = postsJson;
};

data.deletePost = (callback) => {
  let postsJson = localStorage.posts;
  if (!postsJson) {
    postsJson = "[]";
  }

  const posts = JSON.parse(postsJson);

  const index = posts.findIndex(callback);

  if (index > -1) {
    posts.splice(index, 1);

    postsJson = JSON.stringify(posts);
    localStorage.posts = postsJson;
  }
};