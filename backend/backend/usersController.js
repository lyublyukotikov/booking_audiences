// usersController.js

import db from '../backend/database/db.js'
//Контроллер получения всех  пользователей и заявок,которые забронировали пользователи(использую в админ панели)
class UsersController {
  async getUsersAndRequests(req, res) {
    try {
      const result = await db.query(
        'SELECT users.id AS user_id, users.login AS user_login, requests.* FROM users JOIN requests ON users.id = requests.user_id'
      );

      const data = result.rows;
      res.json(data);
    } catch (err) {
      console.error('Ошибка при выполнении SQL-запроса:', err);
      res.status(500).send('Ошибка сервера');
    }
  }
}

export default new UsersController(); 
