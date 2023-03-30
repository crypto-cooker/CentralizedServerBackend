const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const handlebars = require('handlebars');

module.exports = {
    SendEmail: function (template, mailContext, senderEmail, recipientEmail, emailSubject) {
        let args = {
           "auth": {
              "api_key": "e5c080006c2f73021e64c5ca65032bfa-d51642fa-8cc363c0",
              "domain": "no-reply.blocktackle.io"
            }            
        };
        let transporter = nodemailer.createTransport(mg(args));

        let contextObject = mailContext;

        let mailOptions = {
            from: senderEmail,
            subject: emailSubject,
            to: recipientEmail,
            template: {
                name: `Services/v1/Common/EmailTemplates/${template}.hbs`,
                engine: 'handlebars',
                context: mailContext
            }
        };

        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function (err, success) {
                if (err) {
                    console.log(err);
                    resolve(err);
                }
                if (success) {
                    console.log("Success: Send email to: '" + recipientEmail + "'  successful!")
                    console.log(success);
                    resolve(success);
                }
            });
        });
    }
}
