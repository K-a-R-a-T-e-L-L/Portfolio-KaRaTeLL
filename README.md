# 🃏 Portfolio KaRaTeLL

# Веб-приложение-портфолио, отражающее мои навыки в веб-разработке (Next.js + NestJS)

![alt text](portdolio.png)

## 📌 Функционал  

- **Обо мне** (About) — краткая информация.  
- **Навыки** (Skills) — список технологий.  
- **Проекты** (Projects) — галерея проектов с детальным описанием.  
- **Контакты** (Contacts) — список возможных способов связи и форма отправки сообщений в Telegram-бота.  
- **Авторизация** (JWT).
- **Админ-панель** — авторизовавшись как админ, появляется возможность управления контентом непосредственно через веб-интерфейс.

## 🛠️ Технологии  

- **Frontend**: Next.js, React, TypeScript, SCSS  
- **Backend**: NestJS, PostgreSQL, PrismaORM  
- **Дополнительно**: Telegram Bot API, JWT, multer, TailwindCSS ...

## 🚀 Запуск

1. Клонировать репозиторий:  
   ```bash
   git clone https://github.com/K-a-R-a-T-e-L-L/Portfolio-KaRaTeLL

2. Переход в корневую папку:
   ```bash
   cd "Portfolio-KaRaTeLL"

3. Установка зависимостей:
   ```bash
   cd client && npm install
   cd ../server && npm install

4. Настройка env-переменных

5. Сборка и запуск клиента:
   ```bash
   cd ../client
   npm run build && npm run start

6. Сборка и запуск сервера:
   ```bash
   cd ../server
   npx prisma migrate dev && npm run build && npm run start:prod

7. В режиме разработки запуск осуществляется так:
   ```bash
   npx prisma migrate dev && npm run start:dev
   cd ../client
   npm run dev

## 📞 Контакты
   ● **Телеграм** — [@K_a_R_a_T_e_L_L](https://t.me/K_a_R_a_T_e_L_L)
   
   ● **Email** — kirillcuhorukov6@gmail.com
