import { Inter } from 'next/font/google'
import style from '../../styles/home.module.css'
import Head from 'next/head'
import Image from 'next/image'

import HeroImg from '../../public/assets/hero.png'
import { GetStaticProps } from 'next'
import {collection,getDocs} from "firebase/firestore"
import {db} from "../services/firebaseConections"

const inter = Inter({ subsets: ['latin'] })
interface homeProps{
  posts:number,
  comments:number
}
export default function Home({posts,comments}:homeProps) {
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
            <span>+{posts} posts</span>
          </section>
          <section className={style.box}>
            <span> +{comments} comentários</span>
          </section>
        </div> 
      </div>
    </main>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db,"comments");
  const postRef = collection(db,"tarefas");
  const snapshotComment = await getDocs(commentRef);
  const snapshotTarefas = await getDocs(postRef);
  

  return{
    props:{
      posts:snapshotTarefas.size || 0,
      comments:snapshotComment.size || 0
    },
    revalidate:60, // aqui seria revalidade a cada 60 seg
  }
}