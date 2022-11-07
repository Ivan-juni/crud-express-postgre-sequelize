class UserDto {
  email: string
  id: number
  role: string
  constructor(model) {
    this.email = model.email
    this.id = model.id
    this.role = model.role
  }
}

export default UserDto