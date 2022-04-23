import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  doResetPasswordForm: FormGroup;
  id: string;
  isloading = false;
  message: string;
  doMessage: string;
  doSuccess = false;
  success = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly __authService: AuthService,
    private readonly __activeRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
    this.doResetPasswordForm = this.formBuilder.group(
      {
        id: ['', Validators.required],
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
      },
      { validators: this.checkPassword('password', 'cPassword') }
    );
  }

  ngOnInit(): void {
    this.id = this.__activeRoute.snapshot.params.id;
    this.doResetPasswordForm.patchValue({ id: this.id });
  }

  get email(): FormControl {
    return this.resetPasswordForm.controls.email as FormControl;
  }
  get password(): FormControl {
    return this.doResetPasswordForm.controls.email as FormControl;
  }

  async getResetPasswordLink(event) {
    event.preventDefault();
    if (this.resetPasswordForm.valid) {
      try {
        this.isloading = true;
        await this.__authService.getResetPasswordLink(this.email.value);
        this.message = null;
        this.success = true;
      } catch (err) {
        if (err.status === 404) {
          this.message = `Email ${this.email.value} does not exist`;
        }
        this.success = false;
      } finally {
        this.isloading = false;
      }
    }
  }

  async doResetPasswordLink(event) {
    event.preventDefault();
    if (this.doResetPasswordForm.valid) {
      try {
        this.isloading = true;
        await this.__authService.doResetPassword(
          this.doResetPasswordForm.value
        );
        this.doMessage = null;
        this.doSuccess = true;
      } catch (err) {
        if (err.status === 404) {
          this.doMessage = `invalid reset password link, Please request new link`;
        }
        this.doSuccess = false;
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
}
