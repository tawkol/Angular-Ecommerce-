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
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required]],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.signUpForm.valid) {
      this.submitted = true;
      const { name, email, password, phone } = this.signUpForm.value;

      this.userService.register({ name, email, password, phone }).subscribe(
        (response) => {
          this.submitted = false;
          this.userService.setCurrentUser(response); // Update signal
          this.router.navigate(['/home']); // Redirect to home
        },
        (error) => {
          this.submitted = false;
          console.error('Registration error:', error);
        }
      );
    }
  }
}
