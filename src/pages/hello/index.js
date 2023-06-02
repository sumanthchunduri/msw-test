import Link from "next/link";
import React from "react";

export default function Page() {
    const [users, setUsers] = React.useState(() => { 
        console.log(`rendered`) 
        return []
    });
    function getMock() {
        async function as() {
            const js = await fetch("http://localhost:3000/fakeApi/posts", { cache: "force-cache"});
            const data = await js.json();
            setUsers(data);
            console.log(data);
        }
        as();
        console.log(`fecthed getMock()`);
    }
    return (
        <>
            <button onClick={getMock}>get</button>
            <h1>hello</h1>
            <Link href={"/"}>Go back</Link> <br /> <hr />
            {users.map((user) => (
                <Card key={user.id} user={user} />
            ))}
        </>
    )
}



function Card({ user }) {
    return (
        <>
            
            <Link href={`/hello/${user.id}`}>{user.id}</Link>
            <h3>{user.title}</h3>
            <p>{user.content}</p>
            

        </>
    )
}