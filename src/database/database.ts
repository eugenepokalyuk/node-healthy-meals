import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Инициализация и открытие соединения с базой данных
async function openDb() {
  return open({
    filename: './fitness_bot.db',
    driver: sqlite3.Database
  });
}

// Создание таблицы пользователей, если она ещё не создана
export async function setupDb() {
  const db = await openDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id TEXT UNIQUE,
        gender TEXT,
        goal TEXT,
        age INTEGER,
        weight INTEGER,
        height INTEGER,
        activity_level TEXT,
        health_issues TEXT
    )`);
}

// Добавление или обновление данных пользователя
export async function upsertUser(userData: any) {
  const { telegram_id, gender, goal, age, weight, height, activity_level, health_issues } = userData;
  const db = await openDb();

  // Проверяем, есть ли уже пользователь с таким telegram_id
  const user = await db.get("SELECT * FROM users WHERE telegram_id = ?", [telegram_id]);

  if (user) {
    // Если пользователь найден, обновляем его данные
    await db.run(`UPDATE users SET gender = ?, goal = ?, age = ?, weight = ?, height = ?, activity_level = ?, health_issues = ? WHERE telegram_id = ?`, [gender, goal, age, weight, height, activity_level, health_issues, telegram_id]);
  } else {
    // Если пользователя нет, добавляем его в базу
    await db.run(`INSERT INTO users (telegram_id, gender, goal, age, weight, height, activity_level, health_issues) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [telegram_id, gender, goal, age, weight, height, activity_level, health_issues]);
  }
}

export async function checkUserExists(telegram_id: string) {
  const db = await openDb();
  const user = await db.get("SELECT * FROM users WHERE telegram_id = ?", [telegram_id]);
  return !!user; // Returns true if user exists, false otherwise
}
