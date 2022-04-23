import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectService } from '../services';
import {
  ProjectDocument,
  DomainDocument,
  GscSiteDocument,
  ViewsDocument,
} from '../schemas';
import { CreateProjectDTO } from '../dtos';
import { CurrentUser } from 'src/modules/auth/constants';
import { UserService } from 'src/modules/user';
import { UserDocument } from 'src/modules/user/schemas';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}
  @Get('/')
  async getProjects(
    @Req() req,
    @CurrentUser() user,
  ): Promise<ProjectDocument[]> {
    return await this.projectService.getProjects(user);
  }

  @Post('/')
  async createProject(
    @Body() createProjectDTO: CreateProjectDTO,
    @CurrentUser() user,
  ): Promise<ProjectDocument> {
    return await this.projectService.createProject(createProjectDTO, user);
  }

  @Get('/accurDomain')
  async accurDomain(): Promise<DomainDocument[]> {
    return await this.projectService.domain();
  }

  @Get('/gaProperties')
  async gaProperties() {
    return await this.projectService.gaProperties();
  }
  @Get('/gscSites')
  async gscSites(): Promise<GscSiteDocument[]> {
    return await this.projectService.gscSite();
  }

  @Get('/gaViewOfProperty')
  async gaViewOfProperty(@Req() req): Promise<ViewsDocument[]> {
    const { accountId, webPropertyId } = req.query;
    return await this.projectService.gaViewOfProperty(accountId, webPropertyId);
  }

  @Get('/search-user')
  async searchUser(@Query() params): Promise<UserDocument[]> {
    return await this.userService.searchByEmail(params);
  }
  @Get('/:id')
  async getProjectById(@Param('id') id): Promise<ProjectDocument> {
    return await this.projectService.getProjectById(id);
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id,
    @Body() body: CreateProjectDTO,
  ): Promise<ProjectDocument> {
    return await await this.projectService.updateProject(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id): Promise<ProjectDocument> {
    return await this.projectService.deleteProject(id);
  }
}
