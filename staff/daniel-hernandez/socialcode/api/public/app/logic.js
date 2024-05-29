const logic = {};

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_REGEX = /^[a-zA-Z0-9-_]+$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9-_$%&=\[\]\{\}\<\>\(\)]{8,}$/;
const NAME_REGEX = /^[a-zA-Z=\[\]\{\}\<\>\(\)]{1,}$/;

logic.registerUser = (
  name,
  surname,
  email,
  username,
  password,
  repeatedPassword,
  callback,
) => {
  //TODO input validation

  // check if all fields are full
  if (
    !name ||
    !surname ||
    !email ||
    !username ||
    !password ||
    !repeatedPassword
  ) {
    throw new ContentError("All fields are required");
  }

  // name regex
  if (!NAME_REGEX.test(name)) {
    throw new ContentError("Name is not valid");
  }

  // surname regex
  if (!NAME_REGEX.test(surname)) {
    throw new ContentError("Surname is not valid");
  }

  // email regex
  if (!EMAIL_REGEX.test(email)) {
    throw new ContentError("Email is not valid");
  }

  // username regex
  if (!USERNAME_REGEX.test(username)) {
    throw new ContentError("Username is not valid");
  }

  // password regex
  if (!PASSWORD_REGEX.test(password)) {
    throw new ContentError("Password is not valid");
  }

  // check password length
  if (password.length < 8) {
    throw new ContentError("Password should be at least 8 characters long");
  }

  // check if passwords match
  if (password !== repeatedPassword) {
    throw new MatchError("Passwords do not match");
  }

  // check if user exists
  if (data.findUser(username)) {
    throw new DuplicityError("Username already exists");
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 201) {
      callback(null);
      return;
    }

    const { error, errormsg } = JSON.parse(xhr.response);

    const constructor = errors[error];

    callback(new constructor(errormsg));
  };

  xhr.open("POST", "http://localhost:8080/users");

  const body = { name, surname, email, username, password, repeatedPassword };

  const json = JSON.stringify(body);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(json);
};

logic.loginUser = (username, password, callback) => {
  // username regex
  if (!USERNAME_REGEX.test(username)) {
    throw new ContentError();
  }

  // password regex
  if (!PASSWORD_REGEX.test(password)) {
    throw new ContentError();
  }

  // const user = data.findUser(username);

  // // check if user exists
  // if (!user) {
  //   throw new MatchError();
  // }

  // // check if password matches
  // if (user.password !== password) {
  //   throw new MatchError();
  // }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      sessionStorage.username = username;
      callback(null);
      return;
    }

    const { error, errormsg } = JSON.parse(xhr.response);

    const constructor = errors[error];

    callback(new constructor(errormsg));
  };

  xhr.open("POST", "http://localhost:8080/users/auth");

  const body = { username, password };
  const json = JSON.stringify(body);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(json);
};

logic.isUserLoggedIn = () => {
  return !!sessionStorage.username;
};

logic.logoutUser = () => {
  delete sessionStorage.username;
};

logic.getUsername = () => {
  return sessionStorage.getItem("username");
};

// logic.getUsersName = () => {
//   const username = sessionStorage.getItem("username");

//   // check if username is defined correctly, if not redirect to the login page
//   if (username === undefined || username === null) {
//     // for debugging
//     console.error("username is undefined or null");
//     window.location.href = "./login";
//   }

//   const userKey = "user_" + username.toLowerCase();
//   const userKeyString = JSON.stringify(userKey);
//   const userData = JSON.parse(localStorage.getItem(userKeyString));

//   return userData.name;
// };

logic.getAllPosts = (callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const posts = JSON.parse(xhr.response);
      callback(null, posts);
      return;
    }
    const { error, errormsg } = JSON.parse(xhr.response);

    const constructor = errors[error];
    callback(new constructor(errormsg));
  };

  xhr.open("GET", "http://localhost:8080/posts");
  xhr.send();
};

logic.createPost = (title, image, description, callback) => {
  if (typeof title !== "string" || !title.length || title.length > 50) {
    throw new ContentError("Title is not valid.");
  }
  if (typeof image !== "string" || !image.startsWith("http")) {
    throw new ContentError("Image is not valid.");
  }
  if (
    typeof description !== "string" ||
    !description.length ||
    description.length > 200
  ) {
    throw new ContentError("Description is not valid.");
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 201) {
      callback(null);
      return;
    }

    const { error, errormsg } = JSON.parse(xhr.response);
    const constructor = errors[error];

    callback(new constructor(errormsg));
  };

  xhr.open("POST", "http://localhost:8080/posts");
  xhr.setRequestHeader("Authorization", `Basic ${sessionStorage.username}`);

  const body = {
    title,
    image,
    description,
  };

  const json = JSON.stringify(body);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(json);
};

logic.deletePost = (id) => {
  data.deletePost((post) => post.Id === id);
};
