type MessageBase = {
  code: number
  success?: boolean
  message?: string
}

type MessageSuccess<T> = MessageBase & {
  status: 'success'
  data: T | null
  data_string?: string
  new_token?: string
}

type MessageError = MessageBase & {
  status: 'error'
}

type MessageUnAuthorized = MessageBase & {
  status: 'Unauthorized'
}

type MessageNotFound = MessageBase & {
  status: 'Not Found'
}

export type Message<T> = MessageSuccess<T> | MessageError | MessageUnAuthorized | MessageNotFound
export type { MessageSuccess }
