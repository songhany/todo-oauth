// ./components/Header.js
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className='header'>
      <Link href="/">
        Home
      </Link>
      {session && (  // the "User" link will only be displayed when the user is signed in. 
        <Link href={`/user/${session.user.name}`}>
          User
        </Link>
      )}
    </div>
  )
}
