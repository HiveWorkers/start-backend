import * as fs from 'fs';
import * as nodeMailer from 'nodemailer';
import addressparser = require('nodemailer/lib/addressparser');
import base64 = require('nodemailer/lib/base64');
import DKIM = require('nodemailer/lib/dkim');
import fetch = require('nodemailer/lib/fetch');
import Cookies = require('nodemailer/lib/fetch/cookies');
import JSONTransport = require('nodemailer/lib/json-transport');
import Mail = require('nodemailer/lib/mailer');
import MailComposer = require('nodemailer/lib/mail-composer');
import MailMessage = require('nodemailer/lib/mailer/mail-message');
import mimeFuncs = require('nodemailer/lib/mime-funcs');
import mimeTypes = require('nodemailer/lib/mime-funcs/mime-types');
import MimeNode = require('nodemailer/lib/mime-node');
import qp = require('nodemailer/lib/qp');
import SendmailTransport = require('nodemailer/lib/sendmail-transport');
import SESTransport = require('nodemailer/lib/ses-transport');
import shared = require('nodemailer/lib/shared');
import SMTPConnection = require('nodemailer/lib/smtp-connection');
import SMTPPool = require('nodemailer/lib/smtp-pool');
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import StreamTransport = require('nodemailer/lib/stream-transport');
import wellKnown = require('nodemailer/lib/well-known');
import XOAuth2 = require('nodemailer/lib/xoauth2');
import LeWindows = require('nodemailer/lib/sendmail-transport/le-windows');
import LeUnix = require('nodemailer/lib/sendmail-transport/le-unix');
import * as appConfigFile from '../../../AppConfig.json';

export class Email
{
    private server_var: Server;
    private htmlContent_var: string;
    private content_var: string;
    private subject_var: string;
    private author_var: Array<string>;
    private recipient_var:  Array<string>;
    private file_var:  Array<string>;
    constructor()
    {
        this.server_var = {
            host: appConfigFile["email"]["host"],
            port: appConfigFile["email"]["port"],
            secure: appConfigFile["email"]["secure"],
            auth: {
                user: appConfigFile["email"]["user"],
                pass: appConfigFile["email"]["password"]
            }
        }
        this.htmlContent_var = "";
        this.content_var = "";
        this.subject_var = "";
        this.author_var = [];
        this.recipient_var = [];
        this.file_var = [];
        this.author_var = [
            appConfigFile["name"] + " | site web > Devis",
            appConfigFile["email"]["user"]
        ];
    }
    //server(server_var) {
    //  this.server_var = server_var;
    //  return this;
    //}

    async Send(): Promise<{
      status: boolean;
      err?: any
    }>
    {
      return new Promise((resolve,reject)=>{
        try {
          let message: Mail.Options = {};
          if(this.content_var.length > 0){
            message.text = this.content_var;
          }
          if(this.htmlContent_var.length > 0){
            message.html = this.htmlContent_var;
          }
          if(this.author_var[1].length > 0){
            if(this.author_var[0].length > 0){
              message.from = '"' + this.author_var[0] + '" ' + this.author_var[1];
            } else {
              message.from = this.author_var[1];
            }
          }
          if(this.recipient_var.length > 0){
            message.to = this.recipient_var.join(', ');
          }
          if(this.subject_var.length > 0){
            message.subject = this.subject_var;
          }
          if(this.file_var.length > 0){
            message.attachments = this.file_var as Mail.Attachment[];
          }

          //console.log('> server_var');
          //console.log(this.server_var);
          const transporter = nodeMailer.createTransport(this.server_var);
          const mailOptions = message;
          transporter.sendMail(mailOptions, (err: any, info: SMTPTransport.SentMessageInfo) => {
            if (err) {
                console.log(err);
                //throw new BaseError(err);
                //reject(err);
                resolve({
                  status: false,
                  err: err
                });
            } else {
              console.log('Message sent: %s', info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
              resolve({
                status: true
              });
            }
            //resolve({
            //  info: info,
            //  nodeMailer: nodeMailer
            //});
          });
        } catch(err) {
          resolve({
            status: false,
            err: err
          });
        }
      });
    }
    
    HtmlContent(val: string) {
        this.htmlContent_var = val;
        return this;
    }
    Content(val: string) {
        this.content_var = val;
        return this;
    }
    Author(intitule: string, email: string) {
        this.author_var = [intitule, email];
        return this;
    }
    Recipient(val: string) {
        this.recipient_var.push(val);
        return this;
    }
    Subject(val: string) {
        this.subject_var = val;
        return this;
    }
    File(val: string) {
        this.file_var.push(val);
        return this;
    }
}

interface Message{
    text: string;
    html: string;
    from: string;
    to: string;
    subject: string;
    attachments: Array<string>
}
interface Server{
    host: string;
    port: number;
    secure: boolean;
    auth: Auth
}
interface Auth{
    user: string;
    pass: string
}