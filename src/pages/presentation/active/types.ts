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

export interface Question {
  questionId: string
  question: string
  totalVotes: number
  isAnswered: boolean
  user: User
  time: Date
}
