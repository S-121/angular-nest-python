import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { UserDocument, USER_COLLECTION_NAME } from '../schemas';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  oauth2Client: any;

  constructor(
    @InjectModel(USER_COLLECTION_NAME)
    private usertModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    @InjectConnection() private connection: Connection,
  ) { }

  async deleteUser(_id): Promise<UserDocument> {
    return this.usertModel.remove({ _id });
  }

  async isEmailExists(email): Promise<boolean> {
    const user = await this.usertModel.findOne({ email }).exec();
    return user ? true : false;
  }
  async getUsers(user): Promise<UserDocument[]> {
    if (String(user.email).match(/@sitemap.io$/) && user.level == 1) {
      return this.usertModel.find().exec();
    } else {
      return this.usertModel.find({ top_admin: user.top_admin }).exec();
    }
  }

  async getUserById(id): Promise<UserDocument> {
    return this.usertModel.findOne({ _id: id }).exec();
  }

  async getUserByResetLink(resetLink): Promise<UserDocument> {
    return this.usertModel
      .findOne({ reset_link: new ObjectId(resetLink) })
      .exec();
  }

  async getUserByGoogleRegisteredEmail(email): Promise<UserDocument> {
    return this.usertModel.findOne({ email: email }).exec();
  }

  async getUserByEmail(email): Promise<UserDocument> {
    const result = await this.usertModel.findOne({ email }).exec();
    return result;
  }

  async searchByEmail(params): Promise<UserDocument[]> {
    const { query, users } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
      if (users) {
        _filters.$and.push({
          email: { $nin: users.split(',') },
        });
      }
    }
    const result = await this.usertModel.find(_filters).sort(_sort).exec();
    return result;
  }

  async createUser(body, user): Promise<UserDocument> {
    const project = new this.usertModel({
      ...body,
      createdBy: user.id,
      level: 2,
      top_admin: user.top_admin,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });
    await this.sendEmail(
      { to: body.email },
      {
        template: 'register',
        context: {
          name: body.name,
        },
        title: 'Welcome on Board @ Sitemap',
      },
    );
    console.log('email sent')
    return project.save();
  }

  async updateUser(id, body, upsert = true): Promise<any> {

    const $or: any = [{ email: body.email }];
    if (id) {
      $or.push({
        _id: new ObjectId(String(id).substring(0, 24).padEnd(24, '0')),
      });
    }
    return this.usertModel.update(
      {
        $or,
      },
      body,
      {
        upsert,
      },
    );
  }

  async sendEmail(
    user: { to: string },
    data: { title: string; context?: Object; template },
  ) {
    try {
      await this.mailerService.sendMail({
        to: user.to,
        from: 'contact@sitemap.io',
        subject: data.title,
        template: data.template,
        context: {
          ...data.context,
        },
      });
    } catch (e) {
      console.log(e)
    }
  }
}
