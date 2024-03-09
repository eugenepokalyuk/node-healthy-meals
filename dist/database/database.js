"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExists = exports.upsertUser = exports.setupDb = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
// Инициализация и открытие соединения с базой данных
function openDb() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sqlite_1.open)({
            filename: './fitness_bot.db',
            driver: sqlite3_1.default.Database
        });
    });
}
// Создание таблицы пользователей, если она ещё не создана
function setupDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDb();
        yield db.exec(`CREATE TABLE IF NOT EXISTS users (
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
    });
}
exports.setupDb = setupDb;
// Добавление или обновление данных пользователя
function upsertUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { telegram_id, gender, goal, age, weight, height, activity_level, health_issues } = userData;
        const db = yield openDb();
        // Проверяем, есть ли уже пользователь с таким telegram_id
        const user = yield db.get("SELECT * FROM users WHERE telegram_id = ?", [telegram_id]);
        if (user) {
            // Если пользователь найден, обновляем его данные
            yield db.run(`UPDATE users SET gender = ?, goal = ?, age = ?, weight = ?, height = ?, activity_level = ?, health_issues = ? WHERE telegram_id = ?`, [gender, goal, age, weight, height, activity_level, health_issues, telegram_id]);
        }
        else {
            // Если пользователя нет, добавляем его в базу
            yield db.run(`INSERT INTO users (telegram_id, gender, goal, age, weight, height, activity_level, health_issues) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [telegram_id, gender, goal, age, weight, height, activity_level, health_issues]);
        }
    });
}
exports.upsertUser = upsertUser;
function checkUserExists(telegram_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDb();
        const user = yield db.get("SELECT * FROM users WHERE telegram_id = ?", [telegram_id]);
        return !!user; // Returns true if user exists, false otherwise
    });
}
exports.checkUserExists = checkUserExists;
