import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import { debouncedAsyncValidator } from './email.vaildator';
import { UsersService } from 'src/app/modules/users/services';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isloading = false;
  fail = false;
  validator;
  googleLoginLink: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly __authService: AuthService,
    private readonly __usersService: UsersService,
    private readonly __router: Router
  ) {
    this.validator = debouncedAsyncValidator((v) => {
      return this.__usersService.isEmailExists(v).pipe(
        map((r) => {
          return r.exist ? { emailExist: 'Email exists' } : null;
        })
      );
    });
    this.registerForm = this.formBuilder.group(
      {
        id: [''],
        name: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
          this.validator,
        ],
        access_token: [''],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
            ),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
            ),
          ]),
        ],
        rememberMe: [],
      },
      { validators: this.checkPassword('password', 'cPassword') }
    );
  }

  async ngOnInit(): Promise<void> {
    const { url } = await this.__authService.getGoogleLoginUrl('register');
    this.googleLoginLink = url;
    const code = this.getParamValueQueryString('code');
    if (code) {
      try {
        this.isloading = true;
        const { user } = await this.__authService.getGoogleUserInfo(
          code,
          'register'
        );
        this.registerForm.patchValue({
          ...user,
          cPassword: user.password,
          password: user.password,
          access_token: user.access_token,
        });

        this.isloading = false;
      } catch (err) {
        this.isloading = false;
        this.fail = true;
      }
    }
  }

  get cPassword(): FormControl {
    return this.registerForm.controls.cPassword as FormControl;
  }

  get name(): FormControl {
    return this.registerForm.controls.name as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.controls.email as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.controls.email as FormControl;
  }
  get rememberMe(): FormControl {
    return this.registerForm.controls.rememberMe as FormControl;
  }

  async register() {
    if (this.registerForm.valid) {
      try {
        this.isloading = true;
        await this.__authService.register(this.registerForm.value);
        this.__router.navigate(['/']);
        this.fail = false;
      } catch (err) {
        this.fail = true;
      } finally {
        this.isloading = false;
      }
    }
  }
  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
