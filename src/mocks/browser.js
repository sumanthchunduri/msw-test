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