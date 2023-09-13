const SibApiV3Sdk = require('sib-api-v3-typescript');
import * as dotenv from 'dotenv';

dotenv.config();

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.SMTP_API_KEY;

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

console.log("TEST")
console.log(sendSmtpEmail)

sendSmtpEmail.subject = "My Report";
sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = {"name":"John Doe","email":"senderemail@gmail.com"};
sendSmtpEmail.to = [{"email":"personemail@gmail.com","name":"Ed"}];
sendSmtpEmail.replyTo = {"email":"replytoemail@gmail.com","name":"SOTM"};
sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
sendSmtpEmail.params = {"parameter":"My param value","subject":"SOTM Report"};


// sendSmtpEmail.subject = "My {{params.subject}}";
// sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
// sendSmtpEmail.sender = {"name":"John Doe","email":"example@example.com"};
// sendSmtpEmail.to = [{"email":"example@example.com","name":"Jane Doe"}];
// sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
// sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
// sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data: any) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error: any) {
  console.error(error);
});
