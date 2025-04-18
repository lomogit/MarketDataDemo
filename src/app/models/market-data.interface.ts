export interface MarketData {
  Time: string;
  [key: string]: string | number | undefined
  [key: `Bid${number}`]: number | undefined;
  [key: `Bid${number}Size`]: number | undefined;
  [key: `Ask${number}`]: number | undefined;
  [key: `Ask${number}Size`]: number | undefined;
}
