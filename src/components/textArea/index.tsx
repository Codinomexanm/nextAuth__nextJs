import React, { HTMLProps } from 'react'
import style from './style.module.css'

const TextArea = ({...test}:HTMLProps<HTMLTextAreaElement>) => {
  return <textarea className={style.textArea} {...test}></textarea>
}

export default TextArea
