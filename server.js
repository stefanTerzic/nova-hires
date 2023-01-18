const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ovo ce po defaultu da gleda public i da renderuje index.html
app.use(express.static(__dirname + '/public'));

/* ovde mozeds da devinises stranice/rute kao gore
 *
 * app.get('/about-us', (req, res, next) => {
 *   res.sendFile(__dirname, '/public/about-us.html');
 * });
 */

// primer za rutiranje
app.get('/wip', (req, res, next) => {
  res.sendFile(__dirname + '/public/wip.html');
});

const MY_EMAIL = 'stefanterzic94@gmail.com';

app.get('/contact-us', (req, res, next) => {
  try {
    // i ovde dodaj neku validaciju cisto zob security-ja :)

    const {
      firstName,
      lastName,
      companyName,
      email,
      phone,
    } = req.query;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MY_EMAIL,
        // da dobijes ovaj password pogledaj sa pocetka ovaj clanak -> https://miracleio.me/snippets/use-gmail-with-nodemailer/
        // takodje ukoliko zelis mozes ovo i da sakrijes enviroment variables pa mu pristupas samo: process.env.GMAIL_PASSWORD
        pass: 'upfhvcbpwaxiiyae'
      }
    });

    const fullName = `${firstName} ${lastName}`;

    const mailOptions = {
      from: email,
      to: MY_EMAIL,
      subject: `New email from ${fullName} - ${email}`,
      text: `Hey ${fullName} from ${companyName} wants to reach you. His phone is: ${phone}. I tako dalje i tako dalje! :D`
    }

    console.log(mailOptions);

    transporter.sendMail(mailOptions);

    res.send("Email sent!");
  } catch (e) {
    next(e);
  }
});

const port = process.env.PORT || 5050;
app.listen(port, () => console.info(`Listening on port ${port}...`));
