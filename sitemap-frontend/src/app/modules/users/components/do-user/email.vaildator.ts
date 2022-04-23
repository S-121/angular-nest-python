import { Observable, BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap, catchError, take } from 'rxjs/operators';
import {
  ValidationErrors,
  AsyncValidatorFn,
  AbstractControl,
} from '@angular/forms';

export const debouncedAsyncValidator = (
  remoteValidation: (v: string) => Observable<ValidationErrors | null>,
  remoteError: ValidationErrors = { remote: 'Unhandled error occurred.' },
  debounceMs = 300
): AsyncValidatorFn => {
  const values = new BehaviorSubject<string>(null);
  const validity$ = values.pipe(
    debounceTime(debounceMs),
    switchMap(remoteValidation),
    catchError(() => of(remoteError)),
    take(1)
  );

  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    values.next(control.value);
    return validity$;
  };
};
