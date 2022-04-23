import { Injectable, Logger, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { fetchKeywordRankings, getPerformance } from 'src/scripts';
import { DataService } from 'src/modules';
import { GAService } from 'src/modules/google-analytics/services';
import { Cache } from 'cache-manager';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class TasksPageSpeedService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
    private dataService: DataService,
    private gaService: GAService,
  ) {}
  private readonly logger = new Logger(TasksPageSpeedService.name);

  @Cron('0 0 6 * * *')
  async handleCron() {
    console.log('TasksPageSpeedService Cron Started');
    this.logger.debug('Cron Started ...');

    const projects = await this.dataService.retrieveProjects();

    for (const project of projects) {
      console.log('Stored Page Speed  for project ' + project.name);
      try {
        await this.syncProjectPerformanceDetails(project, project.createdBy);
      } catch (error) {
        console.log(error);
      }
      await this.delay(5000);
    }

    this.logger.log('All Page Speed have been successfully stored in database');
  }

  async syncProjectPerformanceDetails(project, user) {
    const { viewId, _id } = project;
    const coll_name = `performance_${_id}`;
    const detailed_coll_name = `performance_detail_${_id}`;
    const { breif, detailed } = await getPerformance(user, viewId);
    this.cacheManager.set(coll_name, true, { ttl: 100000 });
    await this.gaService.populateDB(coll_name, breif);
    await this.gaService.populateDetailedDB(detailed_coll_name, detailed);
  }

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
