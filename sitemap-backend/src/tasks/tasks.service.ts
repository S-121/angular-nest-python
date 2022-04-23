import { Injectable, Logger, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { fetchKeywordRankings } from 'src/scripts';
import { DataService } from 'src/modules';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dataService: DataService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 14 * * *', {
    timeZone: 'America/New_York'
  })
  async handleCron() {
    if (
      process.env.ZUTRIX_API !== undefined &&
      process.env.ZUTRIX_API == 'true'
    ) {
      this.logger.debug('Cron Started ...');

      const projects =
        await this.dataService.retrieveProjectsAssocaitedWithKeywords();

      for (const project of projects) {
        try {
          const keyword_rankings = await fetchKeywordRankings(
            project.keywords,
            project._url,
            project._id,
          );
          await this.dataService.storeKeywordRankings(
            keyword_rankings,
            project._id,
          );
        } catch (err) {
          console.log(err);
        }
        console.log('Stored keyword rankings for project ' + project.name);
        await this.delay(5000);
      }

      this.logger.log('All keywords have been successfully stored in database');
    }
  }

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
