import React from 'react'
import style from './style.module.css'
import Link from 'next/link'
import {useSession,signIn,signOut} from 'next-auth/react'
const Header = () => {
   const {data:session, status} = useSession();
  return (
  <header className={style.header}>
    <section className={style.content}>
      <nav className={style.nav}>
        <Link href='/'>
        <h1 className={style.logo}>Tarefas<span>+</span></h1>
        </Link>
        {session?.user && (<Link href='/dashboard' className={style.link}>Meu Painel</Link>)}
      </nav>
      {status ==="loading"?(<></>)
      :
      session?
       (<button onClick={()=> signOut()} className={style.loginButton}>Ola {session?.user?.name}</button>)
       :
       (
        <button onClick={()=> signIn('google')} className={style.loginButton}>Acessar</button>
      )}
    </section>
  </header>
  )
}

export default Header
