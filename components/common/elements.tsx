import { useState, useCallback } from 'react'

/**
 * Input
 */

export interface useInputProps {
  value: string,
  error?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export interface useInputError {
  (status: string): void
}

export const useInput = (
  initialValue: string
): [useInputProps, useInputError, () => void] => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | undefined>(undefined)

  return [
    {
      value,
      error,
      onChange: e => setValue(e.target.value)
    },
    status => setError(status),
    () => setValue(initialValue),
  ]
}

/**
 * Select
 */

export interface useSelectProps {
  index: number
  values: string[]
  error?: string,
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface useSelectError {
  (status: string): void
}

interface useSelectSet {
  (values: string[]): void
}

export const useSelect = (
  initialIndex: number,
  initialValues: string[]
): [useSelectProps, useSelectError, () => void, useSelectSet] => {
  const [index, setIndex] = useState(initialIndex)
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState<string | undefined>(undefined)

  return [
    { index, values, error, onChange: (e) => setIndex(e.target.selectedIndex) },
    status => setError(status),
    () => setIndex(0),
    useCallback(values => setValues(values), []),
  ]
}
