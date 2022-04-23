import { Component, OnInit } from '@angular/core';
import { GaService } from '../../services';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-ga-tab-one',
  templateUrl: './ga-tab-one.component.html',
  styleUrls: ['./ga-tab-one.component.scss'],
})
export class GaTabOneComponent implements OnInit {
  data: any;
  isLoading: boolean;
  round: Function = Math.round;
  diffOrganicSession: any = {};
  diffOrganicView: any = {};
  diffBounce: any = {};
  diffOrganicPage: any = {};
  diffTime: any = {};
  organicTimeFormat = 'mm:ss'

  constructor(
    private readonly __gaService: GaService,
    private readonly __appService: AppService
  ) { }

  async getData() {
    try {
      this.isLoading = true;
      this.data = await this.__gaService.getOrganicData();
      const {
        currentMonthSessions,
        lastMonthSessions,
        currentMonthPageviews,
        lastMonthPageviews,
        currentMonthBounceRate,
        lastMonthBounceRate,
        currentMonthPageviewsPerSession,
        lastMonthPageviewsPerSession,
        currentMonthTimeOnPage,
        lastMonthTimeOnPage,
        lastCurrentSessions,
        lastCurrentBounceRate,
        lastCurrentPageviews,
        lastCurrentPageviewsPerSession,
        lastCurrentTimeOnPage,
      } = this.data;

      const diffSessionvalue =
        Number(currentMonthSessions) - Number(lastCurrentSessions);
      this.diffOrganicSession.value = Math.abs(diffSessionvalue);
      this.diffOrganicSession.direction = diffSessionvalue > 0 ? true : false;

      const diffSViewValue =
        Number(currentMonthPageviews) - Number(lastCurrentPageviews);
      this.diffOrganicView.value = Math.abs(diffSViewValue);
      this.diffOrganicView.direction = diffSViewValue > 0 ? true : false;

      const diffSBounceValue =
        Number(currentMonthBounceRate) - Number(lastCurrentBounceRate);
      this.diffBounce.value = Math.abs(diffSBounceValue);
      this.diffBounce.direction = diffSBounceValue > 0 ? true : false;

      const diffOrganicPageValue =
        Number(currentMonthPageviewsPerSession) -
        Number(lastCurrentPageviewsPerSession);
      this.diffOrganicPage.value = Math.abs(diffOrganicPageValue);
      this.diffOrganicPage.direction = diffOrganicPageValue > 0 ? true : false;

      const diffTimeValue = Math.round(
        (Number(currentMonthTimeOnPage) - Number(lastCurrentTimeOnPage)) / 1000
      );
      this.diffTime.value =
        (Math.abs(diffTimeValue) / ((new Date(lastCurrentTimeOnPage).getMinutes() * 60) + new Date(lastCurrentTimeOnPage).getSeconds())) *
        100;

      this.diffTime.direction = diffTimeValue > 0 ? true : false;

      this.isLoading = false;
    } catch (err) {
    } finally {
      this.isLoading = false;
    }
  }
  async ngOnInit(): Promise<void> {
    await this.getData();
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }
}
