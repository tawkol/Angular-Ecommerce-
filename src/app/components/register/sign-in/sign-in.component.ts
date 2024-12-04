import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signInForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.signInForm.valid) {
      this.submitted = true;
      const { email, password } = this.signInForm.value;

      this.userService.login({ email, password }).subscribe(
        (response) => {
          this.submitted = false;
          this.userService.setCurrentUser(response); // Update signal
          this.router.navigate(['/home']); // Redirect to home
        },
        (error) => {
          this.submitted = false;
          console.error('Login error:', error);
        }
      );
    }
  }
}
