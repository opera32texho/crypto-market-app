import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarketComponent } from './market/market.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MarketComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'crypto-market-app';
}
