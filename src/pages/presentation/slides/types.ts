interface User {
  _id: string
  email: string
  name: string
}

export interface Chat {
  message: string
  user: User
  time: Date
}
