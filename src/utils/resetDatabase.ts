import Dexie from "dexie";
import { db } from "../db/db";

export const resetAppData = async () => {
  const confirmed = window.confirm(
    "this will delete EVERYTHING!!!!!"
  );

  if (!confirmed) return;

  try {
    await db.transaction('rw', db.habits, db.logs, async () => {
      await db.logs.clear();
      await db.habits.clear();
    });

    console.log("Database cleared successfully.");
    
  } catch (error) {
    console.error("Failed to reset database:", error);
    alert("An error occurred while trying to reset your data.");
  }
};

export const nukeDatabase = async () => {
  await db.close();
  await Dexie.delete('HabitTrackerDB');
  console.log("Database deleted. Reloading to recreate with new schema...");
  window.location.reload();
};