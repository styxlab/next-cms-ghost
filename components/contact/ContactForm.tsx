import { useEffect, useState } from 'react'
import { useInput, useSelect } from '@components/common/elements'
import { useLang, get } from '@utils/use-lang'

import { Validate } from './ContactValidation'
import { handleSubmit } from './ContactSubmit'
import styles from './ContactForm.module.css'

export interface ServiceConfig {
  url: string
  contentType: string
}

interface ContactFormProps {
  topics: string[]
  serviceConfig: ServiceConfig
}

export const ContactForm = ({ topics, serviceConfig }: ContactFormProps) => {
  const text = get(useLang())
  const [name, setNameError, clearName] = useInput('')
  const [email, setEmailError, clearEmail] = useInput('')
  const [textArea, setTextAreaError, clearTextArea] = useInput('')
  const [robot] = useInput('')
  const [subjects, setSubjectError, clearSubject] = useSelect(0, topics)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')

  const fields = { name, email, subject: subjects, message: textArea, formname: robot }
  const errors = Object.entries(fields).map(([_, value]) => value.error)

  const clear = [clearName, clearEmail, clearTextArea, clearSubject]
  const clearForm = () => clear.forEach(c => c())

  const validate = new Validate()
  const validateAll = ({ name, email, subject, message }: typeof fields) => {
    if (!validate.name(name, setNameError)) return false
    if (!validate.email(email, setEmailError)) return false
    if (!validate.subjects(subject, setSubjectError)) return false
    if (!validate.message(message, setTextAreaError)) return false
    return true
  }

  useEffect(() => {
    const error = errors.find(error => error)
    if (error) return setMessage(error)
    setMessage('')
  }, [errors])

  return (
    <>
      <span className={styles.validate}>
        <div>{message}</div>
      </span>
      <form
        name="next-ghost-contact"
        method="post"
        action=""
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!validateAll(fields)) return
          handleSubmit(serviceConfig, fields, clearForm, (msg: string) => setSuccess(msg))
        }}
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className={styles.contact}
      >
        <input
          {...name}
          onBlur={() => validate.name(name, setNameError)}
          id="name"
          name="name"
          type="text"
          placeholder={text(`FULL_NAME`)}
          className={styles.element}
        />
        <input
          {...email}
          onBlur={() => validate.email(email, setEmailError)}
          id="email"
          name="email"
          type="email"
          placeholder={text(`EMAIL_ADDRESS`)}
          className={styles.element}
        />
        {subjects.values.length > 0 &&
          <select
            {...subjects}
            onBlur={() => validate.subjects(subjects, setSubjectError)}
            id="subject"
            name="subject"
            value={subjects.index}
            className={styles.element}
          >
            <option value={0} hidden>{text(`PLEASE_SELECT`)}</option>
            {subjects.values.map((topic, i) => (
              <option value={i + 1} key={`option-${i + 1}`}>
                {topic}
              </option>
            ))}
          </select>
        }
        <textarea
          {...textArea}
          onBlur={() => validate.message(textArea, setTextAreaError)}
          id="message"
          name="message"
          placeholder={text(`YOUR_MESSAGE`)}
          rows={5}
          className={styles.element}
        />
        <input
          {...robot}
          name="formname"
          className={styles.robot}
        />
        <button className={styles.button} id="submit" type="submit" value="Submit">{text(`SUBMIT`)}</button>
        <span className={styles.response}>{success}</span>
      </form>
    </>
  )
}
