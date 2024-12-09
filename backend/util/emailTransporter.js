import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'ENTER_HOST_URL', // Mailtrap host
  port: 'ENTER_PORT', // Mailtrap port
  auth: {
    user: 'ENTER_USERNAME', // Mailtrap username
    pass: 'ENTER_PASSWORD', // Mailtrap password
  },
});

export default transporter;
