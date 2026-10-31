export interface TripProfitabilityRow {
  id: string;
  routeNo: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  date: string;
  status: string;
  distanceKm: number;
  revenue: number;
  fuelCost: number;
  tollCost: number;
  driverCost: number;
  otherCost: number;
  totalCosts: number;
  profit: number;
}

export interface TripProfitabilityReport {
  startDate: string;
  endDate: string;
  tripCount: number;
  totalRevenue: number;
  totalTripCosts: number;
  totalFuelCost: number;
  totalTollCost: number;
  totalDriverCost: number;
  totalOtherCost: number;
  totalExpenses: number;
  totalCosts: number;
  totalProfit: number;
  trips: TripProfitabilityRow[];
}
