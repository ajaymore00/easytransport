export interface DashboardRoute {
  id: number | string;
  route: string;
  time?: string;
  date?: string;
  status?: string;
}

export interface DashboardVehicle {
  id: number | string;
  name: string;
  type: string;
  status: string;
}

export interface DashboardExpense {
  id: number | string;
  type: string;
  amount: number;
  date: string;
}

export interface DashboardDriver {
  id: number | string;
  name: string;
  contact: string;
}

export interface DashboardData {
  todayRoutes: DashboardRoute[];
  futureRoutes: DashboardRoute[];
  vehicles: DashboardVehicle[];
  expenses: DashboardExpense[];
  drivers: DashboardDriver[];
}
