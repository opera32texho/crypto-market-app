export interface TradeData {
  type: string;
  symbol_id: string;
  price: number;
  size: number;
  taker_side: string;
  time_exchange: string;
  time_coinapi: string;
  uuid: string;
}

export interface SubscribeOutRequest {
  type: string;
  apikey: string;
  heartbeat: boolean;
  subscribe_data_type: string[];
  subscribe_filter_asset_id: string[];
  subscribe_filter_exchange_id: string[];
}
