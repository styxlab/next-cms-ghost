import { useLang, get } from '@utils/use-lang'
import { useInputProps, useInputError, useSelectProps, useSelectError } from '@components/common/elements'

export class Validate {
  text

  constructor() {
    this.text = get(useLang())
  }

  name(item: useInputProps, setError: useInputError) {
    if (item.value.length === 0) {
      setError(`${this.text(`FULL_NAME_REQUIRED`)}.`)
      return false
    }
    if (item.value.length < 3) {
      setError(`${this.text(`FULL_NAME_MUST_BE`)} ${this.text(`AT_LEAST`)} 3 ${this.text(`CHARACTERS_LONG`)}.`)
      return false
    }
    if (item.value.length > 20) {
      setError(`${this.text(`FULL_NAME_MUST_BE`)} 20 ${this.text(`CHARACTERS_OR_LESS`)}.`)
      return false
    }
    setError('')
    return true
  }

  email(item: useInputProps, setError: useInputError) {
    if (item.value.length === 0) {
      setError(`${this.text(`EMAIL_IS_REQUIRED`)}.`)
      return false
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(item.value)) {
      setError(`${this.text(`INVALID_EMAIL_ADDRESS`)}.`)
      return false
    }
    setError('')
    return true
  }

  subjects(item: useSelectProps, setError: useSelectError) {
    if (item.index === 0) {
      setError(`${this.text(`PLEASE_SELECT_SUBJECT`)}.`)
      return false
    }
    setError('')
    return true
  }

  message(item: useInputProps, setError: useInputError) {
    if (item.value.length === 0) {
      setError(`${this.text(`MESSAGE_TEXT_IS_REQUIRED`)}.`)
      return false
    }
    if (item.value.length < 10) {
      setError(`${this.text(`MESSAGE_MUST_BE`)} ${this.text(`AT_LEAST`)} 10 ${this.text(`CHARACTERS_LONG`)}.`)
      return false
    }
    if (item.value.length > 4000) {
      setError(`${this.text(`MESSAGE_MUST_BE`)} 4000 ${this.text(`CHARACTERS_OR_LESS`)}.`)
      return false
    }
    setError('')
    return true
  }
}
