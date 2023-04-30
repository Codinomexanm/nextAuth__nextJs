import React, { ChangeEvent, FormEvent, useState } from 'react'
import Head from 'next/head'
import style from './style.module.css'
import { GetServerSideProps } from 'next';
import {db} from '../../services/firebaseConections'
import TextArea from '../../components/textArea/index';
import {FaTrash} from "react-icons/fa"
import { useSession } from 'next-auth/react';
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore'

interface TaskProps{
  item:{
    tarefa:string,
    public:boolean,
    created:string,
    user:string,
    taskId:string
  },
  allComments:CommentsPropos[],
}
interface CommentsPropos{
    id: string,
    comment:string,
    user:string,
    name:string,
    taskId:string
}

const Task = ({item,allComments}:TaskProps) => {

  const {data: session} = useSession();
  const [input,setInput] = useState("");
  const [comments,setComments] = useState<CommentsPropos[]>(allComments || [])

  async function handleComment(event: FormEvent){
    event.preventDefault();
    if(input === "") return;
    if(!session?.user?.email || !session?.user?.name) return;
    try {
      const docRef = await addDoc(collection(db, "comments"),{
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId:item?.taskId,
      });
      const data ={
        id:docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId:item?.taskId,
      }
      setComments((oldItems)=>[...oldItems,data])
      setInput("");
    } catch (error) {
      console.log(error);
      
    }
  }
  async function handleDeleteComment(id:string) {
    try {
        const docRef = doc(db,"comments",id);
        await deleteDoc(docRef);
        const deleteComment = comments.filter((item)=> item.id !== id);
        setComments(deleteComment);
        
    } catch (error) {
      console.log(error);
      
    }
  }

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
        <form onSubmit={handleComment}>
          <TextArea
          value={input}
          onChange={(event:ChangeEvent<HTMLTextAreaElement>)=>setInput(event.target.value)}
          placeholder='Digite seu comentário'
          />
          <button disabled={!session?.user} className={style.Button}>Enviar</button>
        </form>
      </section>
      <section className={style.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length===0 &&(
          <span>Nenhum comentário foi encontrado</span>
        )}
        {comments.map((item)=>(
          <article key={item.id} className={style.comment}>
            <div className={style.headComment}>
              <label className={style.commentLabel}>{item.name}</label>
            {item.user === session?.user?.email&&(
                <button className={style.ButtonTrash} onClick={()=>handleDeleteComment(item.id)}>
                 <FaTrash size={18} color='#EA3140'/>
               </button>
            )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Task


export const getServerSideProps:GetServerSideProps = async ({ params }) =>{
  const id = params?.id as string;
  const docRef = doc(db,"tarefas",id);
  const q = query(collection(db,"comments"),where("taskId","==",id))
  const snapshotComments = await getDocs(q);
  let allComments: CommentsPropos[] = [];
  snapshotComments.forEach((doc)=>{
    allComments.push({
      id:doc.id,
      comment:doc.data().comment,
      user:doc.data().user,
      name:doc.data().name,
      taskId:doc.data().taskId
    })
  })

  
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
      allComments:allComments
    },
  };
}