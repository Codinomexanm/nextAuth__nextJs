import { Inter } from 'next/font/google'
import style from '../../styles/home.module.css'
import Head from 'next/head'
import Image from 'next/image'

import HeroImg from '../../public/assets/hero.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={style.container}>
    <Head>
      <title>Tarefas +</title>
    </Head>
    <main className={style.main}>
      <div className={style.logoContent}>
        <Image
        className={style.hero}
        alt='logo tarefa'
        src={HeroImg}
        priority
        />
        <h1 className={style.title}>sistema feito para se organizar <br/>
        seus estudos e tarefas</h1>
        <div className={style.infoContent}>
          <section className={style.box}>
            <span>+12 posts</span>
          </section>
          <section className={style.box}>
            <span> +90 comentários</span>
          </section>
        </div> 
      </div>
    </main>
    </div>
  )
}
