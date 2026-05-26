import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  profileForm!: FormGroup;
  isEditMode = signal(false); 

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      newPassword: [''] 
    });
  }

  loadUserProfile() {
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue(user); 
      }
    });
  }

  toggleEdit() {
    this.isEditMode.set(!this.isEditMode());
  }

  onUpdate() {
    if (this.profileForm.valid) {
      const { newPassword, ...userData } = this.profileForm.value;
      this.userService.updateProfile(userData, newPassword).subscribe({
        next: () => {
          alert('Profile Updated Successfully!');
          this.isEditMode.set(false);
          this.profileForm.get('newPassword')?.reset(); 
        },
        error: (err) => alert(err.error)
      });
    }
  }

}
