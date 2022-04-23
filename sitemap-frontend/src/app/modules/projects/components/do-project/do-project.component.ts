import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ProjectsService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-do-project',
  templateUrl: './do-project.component.html',
  styleUrls: ['./do-project.component.scss'],
})
export class DoProjectComponent implements OnInit {
  mode: 'ADD' | 'EDIT' = 'ADD';
  success: boolean;
  project: any;
  projectId: string;
  fail: boolean;
  isLoading = false;
  formGroup: FormGroup;
  properties;
  views;
  urls;
  currentProject: any;
  showUsers: boolean;
  selectView: boolean;
  selectedProperty: Object;
  selectedView: Object;
  selectedUrl: Object;
  constructor(
    private readonly __fb: FormBuilder,
    private readonly __projectService: ProjectsService,
    private readonly __activeRoute: ActivatedRoute,
    private readonly __appService: AppService,
    private readonly __router: Router
  ) {
    this.formGroup = this.__fb.group({
      sheetId: [''],
      image: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      domain: [''],
      property: [''],
      viewId: [''],
      url: [''],
      _url: ['', Validators.required],
      csvFilename: [''],
      gsc: [false],
      csv: [''],
      ga: [false],
      users: [],
      projectConversions: ['', Validators.required],
      // keywords: ['', Validators.required],
      keywords: [''],
    });
  }

  ngAfterViewInit() {
    this.selectView = false;
  }

  async ngOnInit(): Promise<void> {
    this.currentProject = this.__appService.getProjectFromLocalStorage();
    this.isLoading = true;
    const [urls, properties] = await Promise.all([
      this.__projectService.gscSites(),
      this.__projectService.gaProperties(),
    ]);
    this.urls = this.sort(urls, 'siteUrl');
    this.properties = this.sort(properties, 'name');
    this.isLoading = false;
    const projectId = this.__activeRoute.snapshot.params.id;
    if (projectId) {
      this.projectId = projectId;
      this.mode = 'EDIT';
      this.project = await this.__projectService.getProjectById(projectId);
      this.showUsers = true;
      this.formGroup.patchValue({ ...(this.project) });
      this.assignPropertyView();
    } else {
      this.showUsers = true;
      this.mode = 'ADD';
    }
  }
  get ga(): FormControl {
    return this.formGroup.controls.ga as FormControl;
  }

  get csvFilename(): FormControl {
    return this.formGroup.controls.csvFilename as FormControl;
  }

  get users(): FormControl {
    return this.formGroup.controls.users as FormControl;
  }

  get domain(): FormControl {
    return this.formGroup.controls.domain as FormControl;
  }

  get csv(): FormControl {
    return this.formGroup.controls.csv as FormControl;
  }

  get image(): FormControl {
    return this.formGroup.controls.image as FormControl;
  }

  get name(): FormControl {
    return this.formGroup.controls.name as FormControl;
  }

  get description(): FormControl {
    return this.formGroup.controls.description as FormControl;
  }

  get viewId(): FormControl {
    return this.formGroup.controls.viewId as FormControl;
  }

  get url(): FormControl {
    return this.formGroup.controls.url as FormControl;
  }

  get _url(): FormControl {
    return this.formGroup.controls._url as FormControl;
  }

  get gsc(): FormControl {
    return this.formGroup.controls.gsc as FormControl;
  }

  get property(): FormControl {
    return this.formGroup.controls.property as FormControl;
  }

  get projectConversion(): FormControl {
    return this.formGroup.controls.projectConversion as FormControl;
  }
  
  get keywords(): FormControl {
    return this.formGroup.controls.keywords as FormControl;
  }

  async assignPropertyView() {
    this.selectedProperty = this.properties.find(
      (p) => p.id === this.project['property']
    );

    this.views = await this.__projectService.gaViewOfProperty(this.selectedProperty['id'], this.selectedProperty['accountId']);      

    this.selectedView = this.views.find(
      (v) => v.id === this.project['viewId']
    );

    this.selectedUrl = this.urls.find(
      (u) => u.siteUrl === this.project['url']
    );

    //We need to assign the object instead of their id(s) because combobox accepts the object only
    this.formGroup.patchValue({
      property: this.selectedProperty,
      viewId: this.selectedView,
      url: this.selectedUrl
    });
  }

  async changeProperty(removeValue = false, propertyName = 'name') {
    let property = '';

    if (propertyName != 'name') {
      property = propertyName;
    } else {
      property = this.property.value;
    }
    
    if (!property) {
      return;
    }
    this.isLoading = true;
    const properties = this.properties.find(
      (p) => p.name === property
    );
    
    if (typeof properties !== 'undefined') {
      const { id, accountId } = properties;
      if (removeValue && this.selectView) {
        this.formGroup.patchValue({ viewId: null});
      }
      this.views = await this.__projectService.gaViewOfProperty(id, accountId);      
      this.selectView = true;
    }
    this.isLoading = false;
  }

  toggelGa() {
    if (this.ga.value) {
      this.selectView = false;
      this.property.setValidators([Validators.required]);
      this.viewId.setValidators([Validators.required]);
      if (this.project) {
        this.formGroup.patchValue({
          property: this.selectedProperty, 
          viewId: this.selectedView
        });
      }
    } else {
      this.property.setValidators([]);
      this.viewId.setValidators([]);
      this.formGroup.patchValue({ property: null, viewId: null });
    }
  }
  toggelGoogleConsole() {
    if (this.gsc.value) {
      this.url.setValidators([Validators.required]);
      if (this.project) {
        this.formGroup.patchValue({ url: this.selectedUrl })
      }
    } else {
      this.url.setValidators([]);
      this.formGroup.patchValue({ url: null });
    }
  }

  urlChanged(url) {
    if (url) {
      
      if (this.properties) {
        const property = this.properties.find(
          (item) => item.name.toLowerCase().indexOf(url.toLowerCase()) >= 0
        );
        if (property) {
          this.formGroup.patchValue({ property: property });
          this.changeProperty(false);
        }
      }
      if (this.urls) {
        const _url = this.urls.find(
          (item) => item.siteUrl.toLowerCase().indexOf(url.toLowerCase()) >= 0
        );
        if (_url) {
          this.formGroup.patchValue({ url: _url });
        }
      }
    }
  }

  loadImage({ target: { files } }) {
    if (files && files[0]) {
      var FR = new FileReader();
      FR.onload = (e) => {
        this.image.setValue(e.target.result);
      };
      FR.readAsDataURL(files[0]);
    }
  }

  loadCSV({ target: { files } }) {
    if (files && files[0]) {
      var FR = new FileReader();
      FR.onload = (e) => {
        console.log({ file: files[0] });
        this.csvFilename.setValue(files[0].name);
        this.csv.setValue(btoa(e.target.result as string));
      };
      FR.readAsBinaryString(files[0]);
    } else {
      this.csvFilename.setValue(null);
      this.csv.setValue(null);
    }
  }

  async save() {

    try {
      this.success = this.fail = false;
      if (this.formGroup.valid) {
        this.isLoading = true;
        const formGroupObj = this.formGroup.value;
          //save id in database
          formGroupObj.property = this.formGroup.controls.property.value.id;
          formGroupObj.viewId = this.formGroup.controls.viewId.value.id;
          formGroupObj.url = this.formGroup.controls.url.value.siteUrl;
          
        if (this.mode === 'ADD') {
          const project = await this.__projectService.save(
            formGroupObj
          );
          requestAnimationFrame(() => this.selectProject(project));
          return;
        } else if (this.mode === 'EDIT') {
          await this.__projectService.updateProject(
            this.__activeRoute.snapshot.params.id,
            formGroupObj
          );
        }
        this.isLoading = false;
        this.success = true;

        if (this.currentProject?.viewId === this.formGroup.value.viewId) {
          localStorage.setItem('project', JSON.stringify(this.formGroup.value));
          this.__appService.changeProjct.emit(true);
        }

        this.__appService.projectsChaged.emit(true);
        document.getElementById('top').scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    } catch (err) {
      this.isLoading = false;
      this.fail = true;
      this.success = false;
    }
  }

  selectProject(project) {
    localStorage.setItem('project', JSON.stringify(project));
    localStorage.setItem('viewId', project.viewId);
    localStorage.setItem('projectId', project._id);
    localStorage.setItem('projectName', project.name);
    this.__appService.changeProjct.emit(true);
    this.__router.navigate(['/main/overview']);
  }

  sort(data, propertyName) {
    return data.sort((a, b) => {
      const textA = a[propertyName].toLowerCase();
      const textB = b[propertyName].toLowerCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0; 
    });
  }
}
