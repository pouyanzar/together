export interface IUser {
  _id?: Object
  name: string
  username: string
  email: string
  photo?: string
  role: 'user' | 'admin'
  password: string
  passwordConfirm?: string
}