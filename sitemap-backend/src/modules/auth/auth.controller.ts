import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Query,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, CurrentUser } from './constants';
import { AuthGuard } from '@nestjs/passport';

import { google } from 'googleapis';
import { UserService } from '../user';
// ec2-18-191-91-74.us-east-2.compute.amazonaws.com
const oauth2Client = new google.auth.OAuth2(
  '6994770623-10828epq0b7nm5l8oo0uobv91bpdj7pv.apps.googleusercontent.com',
  'IehDLrluss8bibGb4QLm0JAx',
  'https://app.sitemap.io'
);

const registerOauth2Client = new google.auth.OAuth2(
  '6994770623-10828epq0b7nm5l8oo0uobv91bpdj7pv.apps.googleusercontent.com',
  'IehDLrluss8bibGb4QLm0JAx',
  'https://app.sitemap.io/signup',
);

const scopes = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() user) {
    const result = await this.userService.updateUser(user.id, user);
    this.authService.sendEmail(
      { to: user.email },
      {
        template: 'register',
        context: {
          name: user.name,
        },
        title: 'Welcome on Board @ Sitemap',
      },
    );
    return result;
  }

  @Get('profile')
  getProfile(@CurrentUser() user) {
    return user;
  }

  @Public()
  @Get('googleLink')
  async getGoogleLoginLink(@Query('method') method: 'login' | 'register') {
    const auth = method === 'login' ? oauth2Client : registerOauth2Client;
    const url = auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
    return { url };
  }

  @Public()
  @Get('googleUserInfo/')
  async getGoogleUserInfo(
    @Query('code') code: string,
    @Query('method') method: 'login' | 'register',
  ) {
    const auth = method === 'login' ? oauth2Client : registerOauth2Client;
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const { data } = await google.oauth2('v2').userinfo.get({ auth });
    const dbUser = await this.userService.getUserByGoogleRegisteredEmail(data.email);
    let user = { ...data, ...tokens, level: 1, top_admin: data.id };
    if (!dbUser) {
      user['password'] = Math.random().toString(36).substring(7);
    } else {
      user['password'] = dbUser.password;
    }
    if (method === 'login') {
      await this.userService.updateUser(data.id, user, true);
    } else {
      const { access_token, refresh_token, name, picture } = user;
      await this.userService.updateUser(
        data.id,
        { access_token, refresh_token, name, picture },
        true,
      );
    }
    return { user };
  }

  @Public()
  @Post('reset-password-link')
  async getResetPasswordLink(@Body() body) {
    const { email } = body;
    await this.authService.getResetPasswordLink(email);
  }

  @Public()
  @Post('do-reset-password')
  async doResetPassword(@Body() body) {
    const { password, id: resetId } = body;
    await this.authService.doResetPassword({ password, resetId });
  }
}
