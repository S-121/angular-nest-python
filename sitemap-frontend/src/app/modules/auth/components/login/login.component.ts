import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  isloading = false;
  fail = false;
  googleLoginLink: string;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly __authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly __router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
      rememberMe: [],
    });
  }
  ngAfterViewInit(): void {}

  async ngOnInit(): Promise<void> {
    const { url } = await this.__authService.getGoogleLoginUrl('login');
    this.googleLoginLink = url;
    const code = this.getParamValueQueryString('code');
    if (code) {
      try {
        this.isloading = true;
        const { user } = await this.__authService.getGoogleUserInfo(
          code,
          'login'
        );
        this.loginForm.patchValue({ ...user });
        await this.login();
        this.isloading = false;
      } catch (err) {
        this.isloading = false;
        this.fail = true;
      }
    }
  }

  changeInput(control, value) {
    this[control].setValue(value);
    this.changeDetectorRef.detectChanges();
    this.loginForm.updateValueAndValidity();
  }
  get email(): FormControl {
    return this.loginForm.controls.email as FormControl;
  }
  get password(): FormControl {
    return this.loginForm.controls.password as FormControl;
  }
  get rememberMe(): FormControl {
    return this.loginForm.controls.rememberMe as FormControl;
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        this.isloading = true;
        const { access_token, ...user } = await this.__authService.login(
          this.loginForm.value
        );
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', access_token);
        this.__router.navigate(['main/projects']);
        this.fail = false;
      } catch (err) {
        this.fail = true;
      } finally {
        this.isloading = false;
      }
    }
  }

  signInWithGoogle(evt) {
    evt.preventDefault();
  }
  getParamValueQueryString(paramName) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }
}
