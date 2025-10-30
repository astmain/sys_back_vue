export const const_jwt = {
    secret: "abcdefg",                                   //私钥
    signOptions: {expiresIn: 24 * 60 * 60 * 30 + 's'},   //24小时*30天
}