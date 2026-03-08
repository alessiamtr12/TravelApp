import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginData = {email:'', password:''};
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router){}

  onLogin(){
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        console.log('Login successful!', user);
        this.router.navigate(['/trips']);
      },
      error: (err)=> {
        this.errorMessage = "Invalid email or password";
      }
    });
  }
}
