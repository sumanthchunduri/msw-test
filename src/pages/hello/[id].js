import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function Page() {
    const [users, setUsers] = React.useState({});
    const router = useRouter();
    function getPost() {
        async function as() {
            const js = await fetch(`http://localhost:3000/fakeApi/posts/${router.query.id}`);
            const data = await js.json();
            setUsers(data);
            console.log(data);
        }
        as();
    }
    return (
        <>
            <button onClick={getPost}>Get one</button>
            <p>Post: {router.query.id}</p>
            <h1>hello</h1>
            <p>{users.title}</p>
            <p>{users.content}</p>
            <hr />
            <Link href={"/hello"}>Go back</Link>
        </>
    )
}


//Page.js renamed to [id].js