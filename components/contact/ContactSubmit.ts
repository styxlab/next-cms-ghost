import { useInputProps, useSelectProps } from '@components/common/elements'
import { useLang, get } from '@utils/use-lang'
import { ServiceConfig } from './ContactForm'

export interface FormValues {
  name: useInputProps
  email: useInputProps
  subject: useSelectProps
  message: useInputProps
  formname: useInputProps
}

export interface DataValues {
  name: string
  email: string
  subject: string
  message: string
  formname: string
}

const encodeFormData = (data: DataValues, contentType: string) => {
  if (contentType === `application/json`) {
    return JSON.stringify(data)
  }
  if (contentType === `application/x-www-form-urlencoded`) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + `=` + encodeURIComponent(data[key as keyof DataValues]))
      .join(`&`)
  }
  return JSON.stringify(data)
}

export const handleSubmit = async (
  serviceConfig: ServiceConfig, values: FormValues, clearForm: () => void, setStatus: (msg: string) => void
) => {
  const { url, contentType } = serviceConfig
  const text = get(useLang())

  // Convert FormValues to DataValues
  const entries = Object.entries(values)
    .map(([key, v]) => 'value' in v ? [key, v.value] : [key, v.index > 0 ? v.values[v.index - 1] : ''])
  const data = Object.fromEntries(entries) as DataValues

  if (data.formname.length === 0) {
    data.formname = `next-ghost-contact`
  } else { //early return if robot
    clearForm()
    setStatus(text(`MESSAGE_SENT`))
    return
  }

  const postURL = (url || `/`)

  // reset and show message as post can be slow!
  clearForm()
  setStatus(text(`ONE_SECOND`))

  //console.log(serviceConfig.url)
  //console.log({ 'Content-Type': contentType })
  //console.log(encodeFormData(data, contentType))

  fetch(postURL, {
    method: `POST`,
    headers: { 'Content-Type': contentType },
    body: encodeFormData(data, contentType),
  }).then(response => response.json())
    .then(data => {
      if (data.error) throw data
      clearForm()
      setStatus(text(`MESSAGE_SENT`))
      window.setTimeout(() => setStatus(''), 30000)
    })
    .catch((error) => {
      clearForm()
      setStatus(`${text(`SENDING_FAILED`)}: ${error.message}`)
      window.setTimeout(() => setStatus(''), 60000)
    })
}
