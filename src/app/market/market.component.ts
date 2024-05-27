import { Component, OnInit } from '@angular/core';
import { HistoricalChartComponent } from './historical-chart/historical-chart.component';
import { MarketDataComponent } from './market-data/market-data.component';

import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { AssetIcon } from '../interface/asset-icon.interface';
import { AssetIconService } from '../service/asset-icon.service';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    CommonModule,
    HistoricalChartComponent,
    MarketDataComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    ScrollingModule,
  ],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss',
  providers: [AssetIconService],
})
export class MarketComponent implements OnInit {
  public searchForm: FormGroup;
  public selectedAsset: string = 'BTC';
  public assetIcons: AssetIcon[] = [];
  public filteredOptions: AssetIcon[] = [];
  public maxDropdownHeight: number = 240;

  constructor(
    private fb: FormBuilder,
    private assetIconService: AssetIconService
  ) {
    this.searchForm = this.fb.group({
      symbol: ['BTC'],
    });
  }

  ngOnInit(): void {
    this.getIcons();
    this.searchForm.get('symbol')?.valueChanges.subscribe((value: string) => {
      this.filteredOptions = this._filter(value);
      if (this.filteredOptions.length < 5) {
        this.maxDropdownHeight = this.filteredOptions.length * 48;
      } else if (this.filteredOptions.length > 5) {
        this.maxDropdownHeight = 240;
      }
    });
  }

  private _filter(value: string): AssetIcon[] {
    const filterValue = value.toLowerCase();
    return this.assetIcons.filter((option) =>
      option.asset_id.toLowerCase().includes(filterValue)
    );
  }
  getIcons(): void {
    this.assetIconService.getAssetIcons().subscribe((icons) => {
      this.assetIcons = icons;
      this.filteredOptions = this.assetIcons;
    });
  }
  onSubscribe(): void {
    this.selectedAsset = this.searchForm.get('symbol')?.value.toUpperCase();
  }
}
