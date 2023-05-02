import { Inter } from 'next/font/google'
import style from '../../styles/home.module.css'
import Head from 'next/head'
import Image from 'next/image'

import HeroImg from '../../public/assets/hero.png'
import { GetStaticProps } from 'next'
import {collection,getDocs, onSnapshot, orderBy, query} from "firebase/firestore"
import {db} from "../services/firebaseConections"
import { FaCopy } from 'react-icons/fa'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })
interface homeProps{
  posts:number,
  comments:number
}
interface TaskProps {
  id:string,
  created: Date,
  public: boolean,
  tarefas: string,
  user: string
}

export default function Home({posts,comments}:homeProps) {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  useEffect(()=>{
    async function loadTarefas() {
     const tarefasRef = collection(db, "tarefas");
     const q = query(
      tarefasRef,
      orderBy("created","desc"),
     )
     onSnapshot(q,(onSnapshot)=>{
      let lista = [] as TaskProps[];
      onSnapshot.forEach((doc)=>{
        lista.push({
          id:doc.id,
          tarefas:doc.data().tarefas,
          created:doc.data().created,
          user:doc.data().user,
          public: doc.data().public
        })
      })
      setTasks(lista);
      
     })
    }
    loadTarefas();
  },[]);

  async function handleShare(tarefas:string){
    await navigator.clipboard.writeText(
      tarefas);
    }
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
        <section className={style.taskContainer}>
          <h1>Minhas tarefas</h1>

          {tasks.map((item)=>(
            <article key={item.id} className={style.task}>
           {item.public && (
             <div className={style.tagContainer}>
             <button className={style.shareButton} onClick={()=>handleShare(item.tarefas)}>
               <FaCopy
               size={22}
               color='#3183ff'
               />
             </button>
              <div className={style.taskContent}>
                  <p>{item.tarefas}</p>
              </div>
           </div>
           )}
          </article>
          ))}
        </section> 
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