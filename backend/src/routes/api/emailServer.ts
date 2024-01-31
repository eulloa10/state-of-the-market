import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import * as dotenv from 'dotenv';
import emailSubscribers from '../../data/emailSubscribers.json'
import {
  Subscribers
} from '../../types/interfaces';

const SibApiV3Sdk = require('sib-api-v3-typescript');

dotenv.config();

const REPORTBUCKET = process.env.AWS_REPORT_BUCKET_NAME;
const REGION = process.env. AWS_REGION;

const subscribers: Subscribers = emailSubscribers;

export const emailServerRouter = express.Router();

emailServerRouter.post('/monthly', async (req: Request, res: Response, next: NextFunction) => {

  const subscriberInfo = Object.values(subscribers)

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.SMTP_API_KEY;

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  // TODO:Move date functionality to utils
  const date = new Date();

  let monthName = date.toLocaleString('default', {
    month: 'short'
  });
  let year = date.getFullYear();

  let reportDate = `${monthName} ${year}`;

  sendSmtpEmail.subject = "State of the Market Report - {{params.reportDate}}";

  sendSmtpEmail.sender = {
    "name": process.env.SMTP_SENDER_NAME,
    "email": process.env.SMTP_SENDER_EMAIL
  };
  sendSmtpEmail.replyTo = {
    "email": process.env.SMTP_SENDER_EMAIL,
    "name": process.env.SMTP_SENDER_NAME
  };
  sendSmtpEmail.headers = {
    "Monthly Report": `Monthly Report ${reportDate}`
  };
  sendSmtpEmail.params = {
    "subject": "State of the Market Report",
    "reportDate": reportDate
  };

  const attachmentUrl = `https://${REPORTBUCKET}.s3.${REGION}.amazonaws.com/State+of+the+Market+Report+-+${monthName}+${year}.xlsx`

  sendSmtpEmail.attachment = [{ "url": attachmentUrl, name: `State of the Market Report - ${monthName} ${year}.xlsx` }];

  try {
    const customEmail = {
      ...sendSmtpEmail
    };

    for (const recipient of subscriberInfo) {
      customEmail.to = [{
        "email": recipient.email,
        "name": recipient.username
      }]

      sendSmtpEmail.params.name = recipient.username;

      customEmail.htmlContent = "<html><body><p>Hi {{params.name}},</p><p>Attached is the {{params.reportDate}} report.</p><p>State of the Market</p></body></html>";

      await apiInstance.sendTransacEmail(customEmail);
    }
    res.status(200).json({
      success: true,
      message: 'Emails sent successfully'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Email distribution failed.'
    });
  }
});
