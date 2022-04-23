import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { UsersService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { debouncedAsyncValidator } from './email.vaildator';

@Component({
  selector: 'app-do-user',
  templateUrl: './do-user.component.html',
  styleUrls: ['./do-user.component.scss'],
})
export class DoUserComponent implements OnInit {
  countries = ['USA', 'CANADA', 'INDIA'];
  mode: 'ADD' | 'EDIT' = 'ADD';
  success: boolean;
  fail: boolean;
  isLoading = false;
  formGroup: FormGroup;
  properties;
  accuDomains;
  views;
  urls;
  validator;
  constructor(
    private readonly __fb: FormBuilder,
    private readonly __usersService: UsersService,
    private readonly __activeRoute: ActivatedRoute
  ) {
    this.validator = debouncedAsyncValidator((v) => {
      return this.__usersService.isEmailExists(v).pipe(
        map((r) => {
          return r.exist ? { emailExist: 'Email exists' } : null;
        })
      );
    });
    this.formGroup = this.__fb.group(
      {
        name: ['', Validators.required],
        country: [''],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
            ),
          ]),
        ],
        // cPassword: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.pattern(
        //       /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
        //     ),
        //   ]),
        // ],
        picture: [''],
      }
      // { validators: this.checkPassword('password', 'cPassword') }
    );
  }
  async ngOnInit(): Promise<void> {
    const userId = this.__activeRoute.snapshot.params.id;
    if (userId) {
      this.mode = 'EDIT';
      const user = await this.__usersService.getUserById(userId);
      this.formGroup.patchValue({ ...user });
      this.email.disable();
    } else {
      this.mode = 'ADD';
      this.email.setAsyncValidators(this.validator);
    }
  }
  get name(): FormControl {
    return this.formGroup.controls.name as FormControl;
  }

  get email(): FormControl {
    return this.formGroup.controls.email as FormControl;
  }

  get country(): FormControl {
    return this.formGroup.controls.country as FormControl;
  }

  // get password(): FormControl {
  //   return this.formGroup.controls.password as FormControl;
  // }

  // get cPassword(): FormControl {
  //   return this.formGroup.controls.cPassword as FormControl;
  // }

  get picture(): FormControl {
    return this.formGroup.controls.picture as FormControl;
  }

  loadImage({ target: { files } }) {
    if (files && files[0]) {
      var FR = new FileReader();
      FR.onload = (e) => {
        this.picture.setValue(e.target.result);
      };
      FR.readAsDataURL(files[0]);
    }
  }
  async save() {
    try {
      this.success = this.fail = false;
      if (this.formGroup.valid) {
        this.isLoading = true;
        if (this.mode === 'ADD') {
          await this.__usersService.save(this.formGroup.value);
          this.formGroup.patchValue({ name: '', description: '' });
        } else if (this.mode === 'EDIT') {
          await this.__usersService.updateUser(
            this.__activeRoute.snapshot.params.id,
            this.formGroup.value
          );
        }
        this.isLoading = false;
        this.success = true;
      }
    } catch (err) {
      this.isLoading = false;
      this.fail = true;
      this.success = false;
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
