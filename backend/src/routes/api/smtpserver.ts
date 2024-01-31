const SibApiV3Sdk = require('sib-api-v3-typescript');
const dotenv = require('dotenv')

dotenv.config({ path: '../../../.env' });

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.SMTP_API_KEY;

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// TODO:Move date functionality to utils
const date = new Date();

let monthName = date.toLocaleString('default', { month: 'long' });
let year = date.getFullYear();

let reportDate = `${monthName} ${year}`;

sendSmtpEmail.subject = "State of the Market Report - {{params.reportDate}}";
sendSmtpEmail.htmlContent = "<html><body><h1>Attached is the {{params.reportDate}} report</h1></body></html>";
sendSmtpEmail.sender = {
  "name": process.env.SMTP_SENDER_NAME,
  "email": process.env.SMTP_SENDER_EMAIL
};
sendSmtpEmail.to = [{
  "email":"user@gmail.com",
  "name":"Ed"
}];
sendSmtpEmail.replyTo = {
  "email": process.env.SMTP_SENDER_EMAIL,
  "name": process.env.SMTP_SENDER_NAME
};
sendSmtpEmail.headers = {
  "Some-Custom-Name":"unique-id-1234"
};
sendSmtpEmail.params = {
  "parameter":"My param value",
  "subject":"State of the Market Report",
  "reportDate": reportDate
};

console.log("SENDSMTPEMAIL", sendSmtpEmail)

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data: any) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error: any) {
  console.error(error);
});
