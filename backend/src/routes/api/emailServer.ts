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
import axios from 'axios';

const SibApiV3Sdk = require('sib-api-v3-typescript');

dotenv.config();

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
    month: 'long'
  });
  let year = date.getFullYear();

  let reportDate = `${monthName} ${year}`;

  sendSmtpEmail.subject = "State of the Market Report - {{params.reportDate}}";
  sendSmtpEmail.htmlContent = "<html><body><p>Hi Encarnacion, testing the email server. Please let me know if you received this and were able to successfully download the report.</p><p>Attached is the {{params.reportDate}} report</p></body></html>";
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

  const attachmentUrl = "https://sotm-reports.s3.us-west-1.amazonaws.com/State+of+the+Market+Report+-+Jan+2024.xlsx"

  sendSmtpEmail.attachment = [{ "url": attachmentUrl, name: `State of the Market Report - ${reportDate}.xlsx` }];

  try {
    const customEmail = {
      ...sendSmtpEmail
    };

    for (const recipient of subscriberInfo) {
      customEmail.to = [{
        "email": recipient.email,
        "name": recipient.username
      }]

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
      message: 'Failed to send emails'
    });
  }
});
