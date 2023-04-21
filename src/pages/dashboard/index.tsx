import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import style from './style.module.css'
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";
import TextArea from '@/components/textArea';
import {FiShare2} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'

import {db} from '../../services/firebaseConections'
import { addDoc, collection, query, orderBy,where,onSnapshot, doc,deleteDoc} from 'firebase/firestore'
import Link from "next/link"
interface HomeProps{
  user:{
    email:string,
  }
}
interface TaskProps {
  id:string,
  created: Date,
  public: boolean,
  tarefas: string,
  user: string
}


const Dashboard = ({user}:HomeProps) => {
  const [input, setInput] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([])

  useEffect(()=>{
    async function loadTarefas() {
     const tarefasRef = collection(db, "tarefas");
     const q = query(
      tarefasRef,
      orderBy("created","desc"),
      where("user","==", user?.email )
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
  },[user?.email]);


  function handleChangePublic(event:ChangeEvent<HTMLInputElement>){
    setPublicTask(event?.target.checked);
  };


  async function handleShare(id:string){
  await navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_URL}/task/${id}`);
    alert("url copiada com sucesso")
  }
  async function handleDeleteTask(id:string){
    const docRef = doc(db,"tarefas", id);
    await deleteDoc(docRef);
  }


  async function handleRegisterTask(event:FormEvent){
      event.preventDefault();
    if(input === "") return;

    try {
    await addDoc(collection(db,"tarefas"),{
      tarefas:input,
      created:new Date(),
      user:user?.email,
      public:publicTask,
    });
    setInput("");
    setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={style.container}>
      <Head>
        <title>meu painel de tarefas</title>
      </Head>
      <main className={style.main}>
        <section className={style.content}>
          <div className={style.contentForm}>
            <h1 className={style.title}>Qual é a sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
              placeholder='Digite qual sua tarefa...'
              value={input}
              onChange={(e:ChangeEvent<HTMLTextAreaElement>)=> setInput(e.target.value) }
              />
              <div className={style.checkBoxArea}>
                <input
                 type="checkbox" className={style.checkBox}
                 checked={publicTask}
                 onChange={handleChangePublic}
                 />
                <label> deixar tarefa publica</label>
                <button type="submit" className={style.button}>registrar</button>
              </div>
            </form>
          </div>
        </section>
        <section className={style.taskContainer}>
          <h1>Minhas tarefas</h1>

          {tasks.map((item)=>(
            <article key={item.id} className={style.task}>
           {item.public && (
             <div className={style.tagContainer}>
             <label className={style.tag}>PUBLICO</label>
             <button className={style.shareButton} onClick={()=>handleShare(item.id)}>
               <FiShare2
               size={22}
               color='#3183ff'
               />
             </button>
           </div>
           )}
            <div className={style.taskContent}>
              {item.public ?
              (
                <Link href={`/task/${item.id}`}>
              <p>{item.tarefas}</p>
                </Link>
              ):(
                <p>{item.tarefas}</p>
              )
            }
              <button onClick={()=>handleDeleteTask(item.id)} className={style.trashButton}>
                <FaTrash
                size={24} color='#ea3140'/>
              </button>
            </div>
          </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async({req})=>{
  const session = await getSession({req});
  // console.log(session);
  if(!session?.user){
    // se não tiver usuário redireciona para Home
    return{
      redirect:{
        destination:'/',
        permanent:false
      }
    }
  }
  return{
    props:{user:{
      email:session?.user?.email,
    }},
  }
}
export default Dashboard
