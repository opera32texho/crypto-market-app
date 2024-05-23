// export interface IHistoricalDataChart {
//   time_period_start: string;
//   time_period_end: string;
//   time_open: string;
//   time_close: string;
//   price_open: number;
//   price_high: number;
//   price_low: number;
//   price_close: number;
//   volume_traded: number;
//   trades_count: number;
// }
export interface IHistoricalDataChart {
  rate_close: number;
  rate_high: number;
  rate_low: number;
  rate_open: number;
  time_close: string;
  time_open: string;
  time_period_end: string;
  time_period_start: string;
}
