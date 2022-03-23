export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || "senhasecreta",
    expiresIn: '1d'
  }
}
