npm i express morgan cors joi mongodb mongoose dotenv @hapi/joi bcryptjs bcrypt jsonwebtoken multer imagemin imagemin-jpegtran imagemin-pngquant avatar-builder

#

bcrypt-Хеширование паролей (.hash, .compare);
jsonwebtoken-стандарт по созданию авторизационных токенов (headers, payload, signature);
multer-для обработки form-data (images);
avatar-builder-avatarGenerate

**Читать на других языках: [Русский](README.md), [Українська](README.ua.md).**

# Домашнее задание 5

Создай ветку `05-images` из ветки `master`.

Продолжи создание REST API для работы с коллекцией контактов. Добавь возможность
загрузки аватарки пользователя через
[Multer](https://github.com/expressjs/multer).

## Шаг 1

Создай папку `public` для раздачи статики. В этой папке сделай папку `images`.
Настрой Express на раздачу статических файлов из папки `public`.

Положи любое изображение в папку `public/images` и проверь что раздача статики
работает. При переходе по такому URL браузер отобразит изображение.

```shell
http://locahost:<порт>/images/<имя файла с расширением>
```

## Шаг 2

В схему пользователя добавь новое свойство `avatarURL` для хранения изображения.

```shell
{
  email: String,
  password: String,
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  }
}
```

- Используй генератор аватарок для того чтобы при регистрации нового
  пользователя сразу сгенерить ему аватар.
- Создай папку `tmp` в корне проекта и сохраняй в неё созданную аватарку.

## Шаг 3

При регистрации пользователя:

- Создавай изображение испопользуя генератор аватарок из шага 2
- Перенеси аватар из папки `tmp` в папку `public/images`
- Создай URL для аватара. Например
  `http://locahost:3000/images/<имя файла с расширением>`
- Сохрани созданный URL в поле `avatarURL` во время создания пользователя

## Шаг 4

Добавь возможность обновления данных уже созданного пользователя, в том числе
аватарки.

![avatar upload from postman](./avatar-upload.png)

```shell
# Запрос
PATCH /users/avatars
Content-Type: multipart/form-data
Authorization: "Bearer token"
RequestBody: загруженный файл

# Успешный ответ
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "avatarURL": "тут будет ссылка на изображение"
}

# Неуспешный ответ
Status: 401 BAD
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

## Дополнительное задание - необязательное

### 1. Написать юнит-тесты для мидлвара по авторизации

(при помощи [mocha](https://www.npmjs.com/package/mocha),
[sinon](https://www.npmjs.com/package/sinon))

- все методы и функции, вызываемые мидлваром (вместе с next) должны быть
  заглушены при помощи sinon
- нужно проверить количество вызовов заглушок и аргументы с которыми они
  вызывались в случаях, когда:
  - пользователь не передал токен в `Authorization` заголовке
  - токен пользователя невалидный
  - токен пользователя валидный

```
Подсказка:
Иногда Вам может понадобится переопределить возвращаемые значения
методов-заглушок
```

### 2. Написать приемочные тесты для ендпоинта обновления аватарок

(дополнительно нужно будет использовать
[supertest](https://www.npmjs.com/package/supertest))

Тесты должны проверять:

- возвращается ли ответ со статус кодом 401, если токен пользователя невалидный
- В случае, если все прошло успешно, проверить:
  - возвращается ли ответ со статус кодом 200
  - возвращается ли тело ответа в правильном формате
  - добавляется ли `avatarUrl` в документ целевого пользователя
