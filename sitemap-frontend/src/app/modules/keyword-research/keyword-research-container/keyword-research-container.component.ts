import { Component, OnInit } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { KeywordService } from '../services';
import { AppService } from 'src/app/app.service';
import { TabTwoComponent } from '../components/tab-two/tab-two.component';
import * as $ from "jquery";

@Component({
  selector: 'app-keyword-research-container',
  templateUrl: './keyword-research-container.component.html',
  styleUrls: ['./keyword-research-container.component.scss']
})

export class KeywordResearchContainerComponent implements OnInit {
  tabTwo: TabTwoComponent;
  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  file = null;
  isloading = false;
  fail = false;

  constructor(
    private readonly __keywordService: KeywordService,
    private readonly __appService: AppService,
  ) {
    this.tabTwo = new TabTwoComponent(this.__keywordService, this.__appService);
  }

  ngOnInit(): void { }

  handleFile({ target: { files } }) {
    if (files && files[0]) {
      this.file = files
    }
  }

  async fileUploader() {
    try {
      this.isloading = true;
      const that = this;
      await this.__keywordService.fileupload(this.file).then(async function (res) {
        if (res) {
          const c_that = that
          await that.__keywordService.dataSave(res.data).then(function (res) {
            console.log("Wow-------", res);
            c_that.tabTwo.ngAfterViewInit();
            c_that.isloading = false;
          })
        }
      });
    } catch (err) {
      console.log("Error", err)
    }
  }

}