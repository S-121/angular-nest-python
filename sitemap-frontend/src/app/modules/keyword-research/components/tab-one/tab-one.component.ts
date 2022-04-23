import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { KeywordService } from '../../services';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';

import { ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'app-tab-one',
  templateUrl: './tab-one.component.html',
  styleUrls: ['./tab-one.component.scss'],
})
export class TabOneComponent implements AfterViewInit {
  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  error: string;
  isLoading = false;
  isFinding = false;
  data: any;
  // dataKeys = [];
  header: any[];
  pageSize: number = 15;
  offset: number = 0;
  count: number = 11;
  refreshFn: Function;
  updateItem: Function;
  firstCall = true;
  params = null;
  @ViewChild('datagridRef') datagrid: ClrDatagrid;

  priorityClasses = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  };
  
  tags: any[] = [];
  focus = null;
  keyup = null;

  constructor(
    private readonly __keywordService: KeywordService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
    this.updateItem = debounce(this.updateItemFn);
  }

  async getData(
    first = false,
    offset = this.offset,
    pageSize = this.pageSize,
    params = undefined
  ) {
    try {
      if (this.datagrid) {
        this.datagrid.dataChanged();
        this.datagrid.resize();
      }
      this.isLoading = true;
      const { data, count } = await this.__keywordService.getkeyword(
        0,
        offset,
        pageSize,
        params
      );
      this.data = data;
      this.count = count;

      requestAnimationFrame(() => {
        if (this.datagrid) {
          this.datagrid.dataChanged();
          this.datagrid.resize();
        }
      });
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getData(true);
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    this.params = searchSort(state);
    this.offset = state.page.size * (state.page.current - 1);
    await this.getData(false, this.offset, this.pageSize, this.params);
  }

  getClass(item) {
    return { [this.priorityClasses[item.priority]]: true };
  }

  async updateItemFn(item, fetch = false) {
    await this.__keywordService.updateRow(item);
    if (fetch) {
      await this.getData(false, this.offset, this.pageSize, this.params);
    }
  }


  inputMultiTags(event: Event) {
    this.focus = event

    if (this.focus.target.tagName === 'I') {
      const tagLabel = this.focus.target.getAttribute('data-item');
      const index = this.tags.indexOf(tagLabel);
      this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
      this.addTags();
    }
  }

  inputValue(event: Event) {
    this.keyup = event
    if (this.keyup.key === 'Enter') {
      if (this.keyup.target.value) {
        for(var i=0; i<this.tags.length; i++) {
          if(this.tags[i] === this.keyup.target.value || this.tags.length >= 5) {
            return
          }
        }
        this.tags.push(this.keyup.target.value);
        this.addTags();
        this.keyup.target.value = '';
      }
    }
  }

  addTags() {
    this.clearTags();
    this.tags.slice().reverse().forEach(tag => {
      document.querySelector('.tag-container').prepend(this.createTag(tag));
    });
  }

  clearTags() {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.parentElement.removeChild(tag);
    });
  }

  createTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');
    const span = document.createElement('span');
    span.innerHTML = label;
    const closeIcon = document.createElement('i');
    closeIcon.innerHTML = 'close';
    closeIcon.setAttribute('class', 'material-icons');
    closeIcon.setAttribute('data-item', label);
    div.appendChild(span);
    div.appendChild(closeIcon);
    return div;
  }

  async find_keywords() {
    try {
      this.isFinding = true
      this.isLoading = true
      const that = this;
      await this.__keywordService.find_keywords(this.tags).then(function (res) {
        const data = res.data
        console.log("that's great-------", data)
        that.data = data.data;
      });
    } catch (err) {
      console.log("Error", err)
    } finally {
      this.isLoading = false;
      this.isFinding = false;
    }
  }

  applyStyles(height) {
    while(1){
      if(height<100){
        break;
      }
      height = height/10;
    }
    const styles = {'height' : height + "%"};
    return styles;
  }
}
