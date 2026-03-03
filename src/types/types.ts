

export type HabbitType = 'numeric' | 'boolean';

export interface Habit {
  _id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  target?: number;
  unit?: string;
  defaultValues?: number[];
  archived: number;
  createdAt: Date;
  type: HabbitType;
  allowOneLogPerDay?: boolean;
  allowedSkipsPerWeek?: number;
}

export interface Log {
  _id: string;
  habitId: string;
  value: number;
  timestamp: Date;
  note?: string; 
  snapshotTarget?: number;
  isSkipped?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
}

export interface ExportData {
  version: string;
  habits: Habit[];
  logs: Log[];
  exportedAt: string;
}