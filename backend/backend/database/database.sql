-- Сущность роли 
CREATE TABLE user_role (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);
--Сущность  пользователей 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL,
    password VARCHAR(300) NOT NULL,
    university VARCHAR(100),
    photo_path VARCHAR(255),
    role_id INTEGER DEFAULT 1, -- По умолчанию роль "user"
    FOREIGN KEY (role_id) REFERENCES user_role(id)
);

-- Сущность аудитории 
CREATE TABLE auditoriums (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    building VARCHAR(50),
    city VARCHAR(50),
    date_available DATE
);

-- Сущность заявок
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,
    event_description TEXT NOT NULL,
    responsible_name VARCHAR(100) NOT NULL,
    responsible_phone VARCHAR(20) NOT NULL,
    responsible_email VARCHAR(100) NOT NULL,
    students_yfu INTEGER,
    students_non_yfu INTEGER,
    auditorium_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (auditorium_id) REFERENCES auditoriums(id)
    FOREIGN KEY (user_id) REFERENCES users(id)
);

