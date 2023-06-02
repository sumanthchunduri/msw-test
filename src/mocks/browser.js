/*
import { setupWorker, rest } from "msw";
import { handlers } from "./handlers";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const NUM_USERS = 3;
const POSTS_PER_USER = 3;
const RECENT_NOTIFICATIONS_DAYS = 7
// export const worker = setupWorker(...handlers);
export const db = factory({
    user: {
      id: primaryKey(nanoid),
      firstName: String,
      lastName: String,
      name: String,
      username: String,
      posts: manyOf("post"),
    },
    post: {
      id: primaryKey(nanoid),
      title: String,
      date: String,
      content: String,
      reactions: oneOf("reaction"),
      comments: manyOf("comment"),
      user: oneOf("user"),
    },
    comment: {
      id: primaryKey(String),
      date: String,
      text: String,
      post: oneOf("post"),
    },
    reaction: {
      id: primaryKey(nanoid),
      thumbsUp: Number,
      hooray: Number,
      heart: Number,
      rocket: Number,
      eyes: Number,
      post: oneOf("post"),
    },
});

const serializePost = (post) => ({
    ...post,
});
  
const createUserData = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        username: faker.internet.userName(),
    };
};

const createPostData = (user) => {
    return {
      title: faker.lorem.words(),
      date: faker.date.recent(RECENT_NOTIFICATIONS_DAYS).toISOString(),
      user,
      content: faker.lorem.paragraphs(),
      reactions: db.reaction.create(),
    }
}
  


for (let i = 0; i < NUM_USERS; i++) {
    const author = db.user.create(createUserData());

    for (let j = 0; j < POSTS_PER_USER; j++) {
        const newPost = createPostData(author)
        db.post.create(newPost)
    }
}
  
export const worker = setupWorker(
    rest.get("/fakeApi/posts", function (req, res, ctx) {
        const posts = db.post.getAll().map(serializePost);
        console.log(posts);
        return res(ctx.json(posts));
      }),
  )

*/

import { setupWorker, rest } from "msw";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import { setupServer } from "msw/node";
import { parseISO } from "date-fns";

const NUM_USERS = 3;
const POSTS_PER_USER = 3;
const RECENT_NOTIFICATIONS_DAYS = 7;
const ARTIFICIAL_DELAY_MS = 2000;

// export const worker = setupWorker(...handlers);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min + 1)) + min;
}

const randomFromArray = (array) => {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
};

export const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf("post"),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    date: String,
    content: String,
    reactions: oneOf("reaction"),
    comments: manyOf("comment"),
    user: oneOf("user"),
  },
  comment: {
    id: primaryKey(String),
    date: String,
    text: String,
    post: oneOf("post"),
  },
  reaction: {
    id: primaryKey(nanoid),
    thumbsUp: Number,
    hooray: Number,
    heart: Number,
    rocket: Number,
    eyes: Number,
    post: oneOf("post"),
  },
});

const serializePost = (post) => ({
  ...post,
  user: post.user.id,
});

const createUserData = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(),
  };
};

const createPostData = (user) => {
  return {
    title: faker.lorem.words(),
    date: faker.date.recent({RECENT_NOTIFICATIONS_DAYS}).toISOString(),
    user,
    content: faker.lorem.paragraphs(),
    reactions: db.reaction.create(),
  };
};

for (let i = 0; i < NUM_USERS; i++) {
  const author = db.user.create(createUserData());
  console.log(`created`);
  for (let j = 0; j < POSTS_PER_USER; j++) {
    const newPost = createPostData(author);
    db.post.create(newPost);
    author.posts.push(newPost);
  }
}

// export const worker = setupWorker(
//   rest.get("/fakeApi/posts", function (req, res, ctx) {
//     const posts = http://db.post.getAll().map(serializePost);
//     return res(ctx.json(posts));
//   })
// );

export const server = setupServer(
  rest.get("/fakeApi/posts", function (req, res, ctx) {
    const posts = db.post.getAll().map(serializePost);
    return res(ctx.json(posts));
  }),
  rest.post("/fakeApi/posts", function (req, res, ctx) {
    const data = req.body;

    if (data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error saving this post!")
      );
    }

    data.date = new Date().toISOString();

    const user = db.user.findFirst({ where: { id: { equals: data.user } } });
    data.user = user;
    data.reactions = db.reaction.create();

    const post = db.post.create(data);
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)));
  }),
  rest.get("/fakeApi/posts/:postId", function (req, res, ctx) {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId } },
    });
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)));
  }),
  rest.patch("/fakeApi/posts/:postId", (req, res, ctx) => {
    const { id, ...data } = req.body;
    const updatedPost = db.post.update({
      where: { id: { equals: req.params.postId } },
      data,
    });
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(serializePost(updatedPost))
    );
  }),

  rest.get("/fakeApi/posts/:postId/comments", (req, res, ctx) => {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId } },
    });
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json({ comments: post.comments })
    );
  }),

  rest.post("/fakeApi/posts/:postId/reactions", (req, res, ctx) => {
    const postId = req.params.postId;
    const reaction = req.body.reaction;
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    });

    const updatedPost = db.post.update({
      where: { id: { equals: postId } },
      data: {
        reactions: {
          ...post.reactions,
          [reaction]: (post.reactions[reaction] += 1),
        },
      },
    });

    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(serializePost(updatedPost))
    );
  }),
  rest.get("/fakeApi/notifications", (req, res, ctx) => {
    const numNotifications = getRandomInt(1, 5);

    let notifications = generateRandomNotifications(
      undefined,
      numNotifications,
      db
    );

    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(notifications));
  }),
  rest.get("/fakeApi/users", (req, res, ctx) => {
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(db.user.getAll()));
  })
);

// for (let i = 0; i < NUM_USERS; i++) {
//   const author = db.user.create(createUserData());

//   for (let j = 0; j < POSTS_PER_USER; j++) {
//     const newPost = createPostData(author);
//     http://db.post.create(newPost);
//   }
// }