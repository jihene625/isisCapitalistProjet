// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'isiscapitalist_Frontend';
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialisation : on récupère le pseudo depuis le service ou le localStorage
    this.username = this.authService.getUsername();
  }
}
