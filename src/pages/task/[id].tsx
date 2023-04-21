import React from 'react'
import Head from 'next/head'
import style from './style.module.css'
import { GetServerSideProps } from 'next';
import {db} from '../../services/firebaseConections'
import TextArea from '../../components/textArea/index';
import {
  doc,
  collection,
  query,
  where,
  getDoc
} from 'firebase/firestore'
interface TaskProps{
  item:{
    tarefa:string,
    public:boolean,
    created:string,
    user:string,
    taskId:string
  }
}

const Task = ({item}:TaskProps) => {
  return (
    <div className={style.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <main className={style.main}>
        <h1>Tarefas</h1>
        <article className={style.task}>
          <p>{item.tarefa}</p>
        </article>
      </main>
      <section className={style.commentsContainer}>
        <h2>Deixar comentário</h2>
        <form action="">
          <TextArea
          placeholder='Digite seu comentário'
          />
          <button className={style.Button}>Enviar comentario</button>
        </form>
      </section>
    </div>
  )
}

export default Task


export const getServerSideProps:GetServerSideProps = async ({ params }) =>{
  const id = params?.id as string;
  const docRef = doc(db,"tarefas",id);
  const snapshot = await getDoc(docRef)
  if(snapshot.data()=== undefined){
    return{
    redirect:{
      destination:"/",
      permanent: false, 
    },
    }
  }
  if(!snapshot.data()=== undefined){
    return{
    redirect:{
      destination:"/",
      permanent: false, 
    },
    }
  }
  const miliseconds = snapshot?.data()?.created?.seconds*1000;
  const task ={
    tarefa:snapshot.data()?.tarefas,
    public:snapshot.data()?.public,
    created:new Date(miliseconds).toLocaleDateString(),
    user:snapshot.data()?.user,
    taskId:id
  }
  
  return{
    props:{
      item: task,
    },
  };
}