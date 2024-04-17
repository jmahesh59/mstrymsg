'use client'
import { signIn, signOut } from 'next-auth/react'
import React from 'react'


export default function Component(){
    
    

    return(
        <>
        Not sign in 
         <button onClick={()=>signIn()}>SignIn</button>
        </>
    )
}
