import Dexie, { type Table } from 'dexie';
import type { Habit, Log } from '../types/types';

class HabitTrackerDB extends Dexie {
  habits!: Table<Habit>;
  logs!: Table<Log>;

  constructor() {
    super('HabitTrackerDB');
    
    this.version(2).stores({
      habits: '_id, archived, createdAt',
      logs: '_id, habitId, timestamp, [habitId+timestamp]'
    });
  }
}

export const db = new HabitTrackerDB();