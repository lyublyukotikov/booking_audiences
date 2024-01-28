
import db from '../backend/database/db.js'
//Контроллер получения пользователей и заявок,которые забронировали пользователи по id(использую в личном кабинете)
class usersRequestByIdController {
async getUsersRequestById(req, res) {
  const { user_id } = req.params; // Извлекаем user_id из параметров запроса
  try {
    const result = await db.query(
      'SELECT auditoriums.id, auditoriums.image_path,auditoriums.is_active, auditoriums.name, auditoriums.building, auditoriums.city, auditoriums.date_available FROM requests JOIN auditoriums ON requests.auditorium_id = auditoriums.id WHERE requests.user_id = $1',
      [user_id]
    );
    const data = result.rows;
    res.json(data);
  } catch (err) {
    console.error('Ошибка при выполнении SQL-запроса:', err);
    res.status(500).send('Ошибка сервера');
  }
}
}
export default new  usersRequestByIdController();