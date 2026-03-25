export interface Dataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: string;
  }
  
  export interface ChartData {
    type: 'LINE' | 'BAR' | 'PIE' | 'RADAR' | 'HEATMAP';
    title: string;
    labels: string[];
    datasets: Dataset[];
    options?: any;
  }