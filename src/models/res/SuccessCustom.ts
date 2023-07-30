// Not use yet
export default class SuccessResponse {
  message: string
  result?: any

  constructor({ message, result }: { message: string; result?: any }) {
    this.message = message
    this.result = result
  }
}
