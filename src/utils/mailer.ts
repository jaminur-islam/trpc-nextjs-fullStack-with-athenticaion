import nodemailer from "nodemailer";

export async function sendLoginEmail({email , url , token}: {token: string,email: string , url: string}){
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
      
    }
  })

  const info = await transporter.sendMail({
    from: '"jaminur Doe" <j.doe@gmail.com>',
    to : email,
    subject: "Login to your account",
    html : `Login by clicking here <a href=${url}/login?token=${token}> click </a>`

  })


  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}