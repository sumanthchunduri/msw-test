import react from "react";
import React from "react";

export default function Page() {
  const [users, setUsers] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  function getMock() {
    async function as() {
      const js = await fetch("https://cw6g8y-3000.csb.app/fakeApi/posts");
      console.log(js);
      const data = await js.json();
      setUsers(data);
      console.log(data);
    }
    as();
  }
  return (
    <>
      <button onClick={getMock}>get</button>
      <h1>hello</h1>
      <label for="title">
        title
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label for="content">
        content
        <input
          id="content"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <button>put</button>
      {users.map((user) => (
        <Card key={user.id} user={user} />
      ))}
    </>
  );
}

function Card({ user }) {
  return (
    <>
      <h3>{user.title}</h3>
      <p>{user.content}</p>
    </>
  );
}
