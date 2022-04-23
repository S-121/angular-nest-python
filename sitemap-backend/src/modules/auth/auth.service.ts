import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user';
import { MailerService } from '@nestjs-modules/mailer';
import * as mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && user.password === pass) {
      const {
        name,
        email,
        _id: id,
        access_token,
        refresh_token,
        picture,
        top_admin,
        level,
      } = user;
      return {
        id,
        name,
        email,
        access_token,
        refresh_token,
        //picture,
        level,
        top_admin,
      };
    }
    return null;
  }

  async login(user: any) {
    const { name, picture, level, top_admin, id } = user;
    const payload = {
      ...user,
    };
    return {
      name,
      picture,
      level,
      top_admin,
      id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getResetPasswordLink(email) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException({ message: 'User not found' }, 404);
    }
    user.reset_link = mongoose.Types.ObjectId();
    await user.save();
    await this.sendEmail(
      { to: email },
      {
        title: 'Sitemap - Reset Password Link',
        template: 'forget-password',
        context: {
          name: user.name,
          link: `http://ec2-18-191-91-74.us-east-2.compute.amazonaws.com:3000/reset-password/${user.reset_link}`,
        },
      },
    );
  }
  async doResetPassword({ password, resetId }) {
    const user = await this.userService.getUserByResetLink(resetId);
    if (!user) {
      throw new HttpException({ message: 'invalid reset link' }, 404);
    }
    user.reset_link = null;
    user.password = password;
    return await user.save();
  }

  async sendEmail(
    user: { to: string },
    data: { title: string; context?: Object; template },
  ) {
    await this.mailerService.sendMail({
      to: user.to,
      from: 'contact@sitemap.io',
      subject: data.title,
      template: data.template,
      context: {
        ...data.context,
      },
    });
  }
}
