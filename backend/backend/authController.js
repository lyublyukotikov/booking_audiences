import db from "../backend/database/db.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import secretKey from "./config/config.js";

//создаем токен
const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};
// Контроллер для авторизации,регистрации и создания токена
class authController {
  //функция получения пользователя
  async getUsers(req, res) {
    try {
      const users = await db.query('SELECT * FROM users');
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
  //функция регистрации
  async registration(req, res) {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Ошибка при регистрации', errors: errors.array() });
      }
      const { login, password, university } = req.body;
      // Проверяем, существует ли пользователь с таким логином
      const result = await db.query('SELECT * FROM users WHERE login = $1', [login]);
      if (result.rowCount > 0) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }
      let role_id = 1; // По умолчанию роль "user"
      // Проверяем, является ли пароль хешем для "admin"
      if (password === 'admin') {
        role_id = 2; // Роль "admin" для пароля "admin"
      }
      // Если пароль не является хешем, хешируем его
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
  
      console.log('Данные перед вставкой:', login, hashedPassword, university);
      const newUser = await db.query('INSERT INTO users (login, password, university, role_id) VALUES ($1, $2, $3, $4) RETURNING *', [login, hashedPassword, university, role_id]);
  
      res.json({ message: 'Пользователь успешно зарегистрирован', user: newUser.rows[0] });
    } catch (e) {
      console.error('Ошибка при регистрации:', e);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
  //функция авторизации 
  async login(req, res) {
    const { login, password,university  } = req.body;

    try {
      const user = await db.query('SELECT * FROM users WHERE login = $1 AND university = $2', [login, university ]);

      if (!user.rows.length) {
        return res.status(400).json({ message: `Пользователь ${login} не найден` });
      }

      const validPassword = bcrypt.compareSync(password, user.rows[0].password);
      if (!validPassword) {
        return res.status(400).json({ message: "Введен неверный пароль" });
      }

      const token = generateAccessToken(user.rows[0].id);
      res.json({ message: "Успешный вход", token });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

export default new authController();