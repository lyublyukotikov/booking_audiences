import { Router } from 'express';
import  authController  from "../backend/authController.js";
import auditoriumsController from './auditoriumsController.js';
import UsersController from './usersController.js'
import { check} from 'express-validator';
import authMiddleware from './middlewaree/authMiddleware.js';
import RequestsController from '../backend/requestsController.js'
import usersRequestByIdController from './usersRequestByIdController.js';
import PhotoProfilContoller from './photoProfilContoller.js';
const router = new Router();
// кастомный валидатор для проверки сущестует или нет пользователь в базе данных


// Определяем маршруты

//Маршрут для регистрации
router.post(
  '/registration',
  // Валидация
  [
    check('login', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 }),
    check('university', "Пароль должен быть больше 4 и меньше 10 символов").notEmpty(),
     check('login', "Пользователь уже сущусвует")
  ],
  authController.registration
);
// Маршрут для авторизации
router.post('/login',authController.login);
// Маршрут для получения всех пользователей
router.get('/users',authMiddleware, authController.getUsers);
// Маршрут для добавления аудиторий 
router.post('/postauditorium',auditoriumsController.postAuditorium)
// Маршрут для изменения статуса аудитории 
router.put('/deactivateAuditorium/:auditorium_id',auditoriumsController.deactivateAuditorium)
// Маршрут для получения всех аудиторий
router.get('/auditoriums',auditoriumsController.getAuditoriums);
// Маршрут для получения аудиторий по id
router.get('/auditoriums/:id,')
 //Получение всех таблиц аудиторий и полльзователей,которые забронировали аудторию (использую в админ панели)
router.get('/users-and-requests',UsersController.getUsersAndRequests);
// Маршрут для создания заявки
router.post('/create-request', RequestsController.createRequest);
//Получение пользователей и заявок,которые забронировали пользователи по id(использую в личном кабинете)
router.get('/users-and-requests/:user_id', usersRequestByIdController.getUsersRequestById);

// Экспортируем router
export default router;