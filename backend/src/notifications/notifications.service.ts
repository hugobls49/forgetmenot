import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM'),
        to,
        subject,
        html,
      });

      this.logger.log(`Email envoyé à ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur d'envoi d'email à ${to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName?: string) {
    const name = firstName || 'utilisateur';
    const subject = 'Bienvenue sur ForgetMeNot';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #4A4A4A; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FFE9D0; padding: 30px; text-align: center; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #D9D9D9; }
            .button { display: inline-block; padding: 12px 30px; background: #FFE9D0; color: #4A4A4A; text-decoration: none; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #8A8A8A; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #4A4A4A; margin: 0;">ForgetMeNot</h1>
            </div>
            <div class="content">
              <h2>Bienvenue ${name}</h2>
              <p>Nous sommes ravis de vous accueillir sur ForgetMeNot.</p>
              <p>Avec ForgetMeNot, vous allez pouvoir :</p>
              <ul>
                <li>Écrire et conserver vos notes importantes</li>
                <li>Recevoir des rappels pour relire vos notes au bon moment</li>
                <li>Améliorer votre mémorisation grâce à la répétition espacée</li>
              </ul>
              <p>Commencez dès maintenant à créer vos premières notes.</p>
              <div style="text-align: center;">
                <a href="${this.config.get<string>('FRONTEND_URL')}" class="button">Commencer</a>
              </div>
            </div>
            <div class="footer">
              <p>ForgetMeNot</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendDailyReminder(email: string, firstName: string, dueCount: number) {
    const subject = `${dueCount} note(s) à relire aujourd'hui`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #4A4A4A; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FFE9D0; padding: 30px; text-align: center; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #D9D9D9; }
            .stats { background: #FFE9D0; padding: 20px; margin: 20px 0; text-align: center; }
            .stats-number { font-size: 48px; font-weight: bold; color: #4A4A4A; }
            .button { display: inline-block; padding: 12px 30px; background: #FFE9D0; color: #4A4A4A; text-decoration: none; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #8A8A8A; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #4A4A4A; margin: 0;">ForgetMeNot</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${firstName}</h2>
              <p>Votre session de relecture quotidienne vous attend.</p>
              <div class="stats">
                <div class="stats-number">${dueCount}</div>
                <p>note(s) à relire</p>
              </div>
              <p>Prenez quelques minutes pour relire vos notes. La régularité est la clé d'une bonne mémorisation.</p>
              <div style="text-align: center;">
                <a href="${this.config.get<string>('FRONTEND_URL')}/review" class="button">Commencer la relecture</a>
              </div>
            </div>
            <div class="footer">
              <p>ForgetMeNot</p>
              <p style="font-size: 12px; margin-top: 10px;">
                <a href="${this.config.get<string>('FRONTEND_URL')}/settings" style="color: #8A8A8A;">Gérer mes préférences</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  // Tâche programmée pour envoyer les rappels quotidiens
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyReminders() {
    this.logger.log('Envoi des rappels quotidiens...');

    try {
      // Récupérer tous les utilisateurs avec les notifications activées
      const users = await this.prisma.user.findMany({
        where: {
          settings: {
            emailNotifications: true,
          },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          settings: true,
        },
      });

      for (const user of users) {
        // Vérifier l'heure de rappel préférée
        const reminderTime = user.settings?.dailyReminderTime || '09:00';
        const [hour, minute] = reminderTime.split(':').map(Number);
        const now = new Date();

        // Envoyer uniquement si c'est l'heure du rappel (avec une marge de 1 heure)
        if (now.getHours() !== hour) continue;

        // Compter les notes à relire
        const dueCount = await this.prisma.note.count({
          where: {
            userId: user.id,
            nextReadDate: {
              lte: new Date(),
            },
          },
        });

        if (dueCount > 0) {
          await this.sendDailyReminder(
            user.email,
            user.firstName || 'utilisateur',
            dueCount,
          );
        }
      }

      this.logger.log('Rappels quotidiens envoyés avec succès');
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi des rappels quotidiens:', error);
    }
  }
}

