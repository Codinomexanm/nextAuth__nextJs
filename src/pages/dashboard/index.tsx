import React from 'react'
import style from './style.module.css'
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";
import TextArea from '@/components/textArea';

const Dashboard = () => {
  return (
    <div className={style.container}>
      <Head>
        <title>meu painel de tarefas</title>
      </Head>
      <main className={style.main}>
        <section className={style.content}>
          <div className={style.contentForm}>
            <h1 className={style.title}>Qual é a sua tarefa?</h1>
            <form action="">
              <TextArea
              placeholder='Digite qual sua tarefa...'
              />
              <div className={style.checkBoxArea}>
                <input type="checkbox" className={style.checkBox}/>
                <label> deixar tarefa publica</label>
                <button type="submit" className={style.button}>registrar</button>
              </div>
            </form>

          </div>
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
    props:{},
  }
}
export default Dashboard
