import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const signToken = (payload: any, options?: jwt.SignOptions) => {
  const privateKey = process.env.JWT_SECRET as string
  const token = jwt.sign(payload, privateKey, options)
  return Promise.resolve(token)
}

export const verifyToken = (token: string) => {
  const privateKey = process.env.JWT_SECRET as string
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      return resolve(decoded as jwt.JwtPayload)
    })
  })
}
