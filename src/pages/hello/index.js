import React from "react";

export default function Page() {
    const [users, setUsers] = React.useState([]);
    function getMock() {
        async function as() {
            const js = await fetch("http://localhost:3000/fakeApi/posts");
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
            {users.map((user) => (
                <Card key={user.id} user={user} />
            ))}
        </>
    )
}



function Card({ user }) {
    return (
        <>
            <h3>{user.title}</h3>
            <p>{user.content}</p>

        </>
    )
}