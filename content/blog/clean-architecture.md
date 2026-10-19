---
title: "Универсальное руководство по Clean Architecture"
description: "Главная цель Чистой архитектуры: создание системы, которая независима от фреймворков, баз данных, UI и внешних сервисов. Бизнес-логика изолирована и является ядром системы."
date: 2026-07-22
category: "Backend"
tags: ["architecture", "pattern", "php"]
cover: "/covers/clean-architecture.webp"
draft: false
---

## Введение

**Clean Architecture** (Чистая Архитектура) — это архитектурный подход, предложенный Робертом Мартином (Uncle Bob), который объединяет идеи Hexagonal Architecture (Порты и Адаптеры), Onion Architecture и Screaming Architecture.

**Главная цель:** создание системы, которая независима от фреймворков, баз данных, UI и внешних сервисов. Бизнес-логика изолирована и является ядром системы.

---

## 📐 Фундаментальные принципы

1. **Правило зависимостей (The Dependency Rule):** Исходный код зависимостей может указывать только внутрь (к центру). Внутренние слои ничего не знают о внешних.
2. **Независимость от фреймворков:** Фреймворки — это просто инструменты. Они не должны диктовать архитектуру.
3. **Тестируемость:** Бизнес-логика может быть протестирована в изоляции, без базы данных, UI или внешних API.
4. **Независимость от UI и БД:** Интерфейс пользователя и способ хранения данных — это внешние детали, которые можно заменить без изменения ядра.

---

## 🧅 Слои Архитектуры и Структура Директорий

Архитектура состоит из четырех основных слоев. Рассмотрим их от центра к периферии.

```text
src/
 │
 ├── Domain/                              # 🧠 ЯДРО (Чистый PHP, ЗАПРЕЩЕНЫ зависимости от фреймворков)
 │   ├── DTO/                             # Доменные DTO (передача данных между слоями)
 │   │   └── UserDTO.php                  # Пример: UserDTO (readonly)
 │   │
 │   ├── Entity/                          # Бизнес-сущности с поведением (Rich Domain Model)
 │   │   ├── User.php                     # Пример: User с методами changeStatus(), block()
 │   │   └── Order.php                    # Не содержат аннотаций ORM!
 │   │
 │   ├── ValueObject/                     # Неизменяемые объекты-значения (Readonly-классы)
 │   │   ├── Email.php                    # Пример: Email, Money, Address
 │   │   └── OrderStatus.php              # Описывают данные, сравниваются по значению
 │   │
 │   ├── Repository/                      # ТОЛЬКО интерфейсы (Contracts) для доступа к данным
 │   │   ├── UserRepositoryInterface.php  # Пример: UserRepositoryInterface
 │   │   └── OrderRepositoryInterface.php # Напр.: save(), findById(), findAll()
 │   │
 │   ├── Service/                         # Интерфейсы для внешних сервисов (если нужно в Domain)
 │   │   └── EmailSenderInterface.php     # Пример: EmailSenderInterface, PaymentGatewayInterface
 │   │
 │   ├── Event/                           # Доменные события (Domain Events)
 │   │   └── UserCreatedEvent.php         # Пример: UserCreatedEvent, OrderPlacedEvent
 │   │
 │   └── Exception/                       # Исключения бизнес-правил
 │       └── UserAlreadyExistsException.php # Пример: OutdatedDataException, InvalidOrderException
 │
 ├── Application/                         # ⚙️ СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ (Оркестрация, зависит от Domain)
 │   ├── Port/                            # Общие интерфейсы Application-слоя (DeeplinkGeneratorInterface)
 │   ├── Common/                          # Общие утилиты (Pagination, DateTime)
 │   │
 │   ├── Voting/                          # Модуль по доменной области (bounded context)
 │   │   ├── Command/                     # DTO команд (readonly)
 │   │   ├── CommandHandler/              # Синхронные обработчики команд (__invoke)
 │   │   ├── Message/                     # Асинхронные сообщения для Messenger
 │   │   ├── MessageHandler/              # Consumer'ы очередей (#[AsMessageHandler])
 │   │   └── DTO/                         # Выходные DTO модуля
 │   │
 │   ├── Season/                          # Аналогичная структура для других модулей
 │   │   ├── Command/
 │   │   ├── CommandHandler/
 │   │   ├── Query/
 │   │   ├── QueryHandler/
 │   │   └── DTO/
 │   │
 │   └── Bot/
 │       ├── Command/                     # (если есть CQRS-команды)
 │       ├── CommandHandler/
 │       ├── Message/
 │       ├── MessageHandler/
 │       └── DTO/
 │
 │   # ⚠️ Не используйте папки UseCase/, Service/ для CQRS-обработчиков.
 │   # CommandHandler/ + QueryHandler/ — стандарт проекта.
 │
 ├── Infrastructure/                      # 🔌 ДЕТАЛИ РЕАЛИЗАЦИИ (Здесь живет фреймворк, БД, API)
 │   ├── Persistence/                     # Работа с базой данных
 │   │   ├── Model/                       # ORM-сущности (Doctrine Models, Eloquent Models)
 │   │   │   ├── UserModel.php            # Пример: UserModel (содержит #[ORM\Entity], #[ORM\Column])
 │   │   │   └── OrderModel.php           # Не содержат бизнес-логики!
 │   │   │
 │   │   ├── Mapper/                      # Мапперы между Domain Entity и Infrastructure Model
 │   │   │   ├── UserMapper.php           # Пример: UserMapper (toDomain(), toModel())
 │   │   │   └── OrderMapper.php          # Конвертирует Domain Entity ↔ ORM Model
 │   │   │
 │   │   └── Repository/                  # Реализации интерфейсов из Domain\Repository
 │   │       ├── DoctrineUserRepository.php  # Пример: DoctrineUserRepository (реализует UserRepositoryInterface)
 │   │       └── EloquentOrderRepository.php # Использует EntityManager, QueryBuilder
 │   │
 │   ├── Integration/                     # Интеграция с внешними API и сервисами
 │   │   ├── Api/                         # HTTP-клиенты для внешних API
 │   │   │   ├── SapClient.php            # Пример: SapClient, StripeClient, SlackClient
 │   │   │   └── StripeClient.php         # Использует Guzzle, Symfony HttpClient
 │   │   │
 │   │   └── Gateway/                     # Реализации интерфейсов из Domain\Service
 │   │       ├── SmtpEmailSender.php      # Пример: SmtpEmailSender (реализует EmailSenderInterface)
 │   │       └── StripePaymentGateway.php # Использует внешние SDK
 │   │
 │   ├── Messaging/                       # Интеграция с очередями сообщений
 │   │   ├── Kafka/                       # Apache Kafka / Redpanda
 │   │   │   ├── Dto/                     # DTO для парсинга JSON из Kafka
 │   │   │   │   └── EmployeeBatchDto.php # Пример: EmployeeBatchDto, OrderEventDto
 │   │   │   ├── Message/                 # Обёртки для сырых сообщений
 │   │   │   │   └── KafkaRawMessage.php  # Пример: KafkaRawMessage
 │   │   │   ├── Serializer/              # Кастомные сериализаторы
 │   │   │   │   └── KafkaRawMessageSerializer.php # Для Symfony Messenger
 │   │   │   └── Handler/                 # Обработчики сообщений из Kafka
 │   │   │       └── EmployeeMessageHandler.php  # Парсят JSON, создают команды, диспатчат в MessageBus
 │   │   │
 │   │   └── RabbitMQ/                    # RabbitMQ (если используется)
 │   │       └── Handler/
 │   │           └── OrderEventHandler.php
 │   │
 │   ├── AutoMapper/                      # Конфигурация автоматического маппинга объектов
 │   │   └── AutoMapperConfig.php         # Пример: AutoMapperConfig (для AutoMapperBundle)
 │   │
 │   ├── Serializer/                      # Настройки сериализации/десериализации
 │   │   └── SerializerConfig.php         # Пример: SerializerConfig (для Symfony Serializer)
 │   │
 │   ├── Validation/                      # Валидаторы и правила валидации
 │   │   ├── Validator.php                # Пример: Validator (обёртка над Symfony Validator)
 │   │   └── Rules/                       # Кастомные правила валидации
 │   │       └── UniqueEmailRule.php
 │   │
 │   ├── DI/                              # Конфигурация контейнера внедрения зависимостей
 │   │   └── services.php                 # Пример: services.php (для Symfony DI, Slim)
 │   │
 │   ├── Console/                         # Системные консольные команды (зависят от фреймворка)
 │   │   └── Command/                     # Кастомные команды (если нужны)
 │   │       └── SyncDataCommand.php      # Пример: SyncDataCommand, ClearCacheCommand
 │   │
 │   └── EventListener/                   # Обработчики событий фреймворка
 │       └── KernelRequestListener.php    # Пример: KernelRequestListener, ExceptionListener
 │
 └── Presentation/                        # 🖥️ ТОЧКИ ВХОДА (HTTP, CLI. Зависит от Application)
     ├── Http/                            # Взаимодействие по HTTP
     │   ├── Controller/                  # HTTP контроллеры (REST, GraphQL)
     │   │   ├── UserController.php       # Пример: UserController, OrderController
     │   │   └── OrderController.php      # Принимают запросы, вызывают CommandHandlers
     │   │
     │   ├── Request/                     # HTTP Request DTO (если нужны)
     │   │   └── CreateUserRequest.php    # Пример: CreateUserRequest, UpdateOrderRequest
     │   │
     │   ├── Response/                    # HTTP Response DTO
     │   │   └── UserResponse.php         # Пример: UserResponse, OrderResponse
     │   │
     │   └── Middleware/                  # Middleware (авторизация, логирование, CORS)
     │       └── AuthMiddleware.php       # Пример: AuthMiddleware, CorsMiddleware
     │
     └── Console/                         # Пользовательские CLI-команды (бизнес-ориентированные)
         └── Command/                     # Пример: ProcessOrdersCommand, GenerateReportCommand
             └── ProcessOrdersCommand.php # Вызывают Application CommandHandlers
```

---

### 🧠 1. Domain Layer (Ядро / Сущности)

Самый внутренний слой. Содержит **корпоративные бизнес-правила** (Enterprise Business Rules). Это сердце приложения.

**Состав:**
* `Entity/` — Бизнес-сущности с поведением (Rich Domain Model). Содержат состояние и методы его изменения.
* `ValueObject/` — Объекты-значения (Value Objects). Не имеют идентификатора, неизменяемы (immutable), сравниваются по значению.
* `Repository/` — ТОЛЬКО интерфейсы (контракты) для доступа к данным.
* `Service/` или `Gateway/` — Интерфейсы для взаимодействия с внешними системами (если их нельзя отнести к Application).
* `Event/` — Доменные события (Domain Events).
* `Exception/` — Исключения, отражающие нарушение бизнес-правил.

**📋 Правила:**

| ✅ РАЗРЕШЕНО                                               | ❌ ЗАПРЕЩЕНО                                        |
|:-----------------------------------------------------------|:----------------------------------------------------|
| Чистый PHP (без зависимостей от фреймворков)               | Использовать аннотации ORM (Doctrine, Eloquent)     |
| Создание интерфейсов (контрактов)                          | Зависеть от HTTP, CLI, Базы Данных                  |
| Использование независимых библиотек (напр., `ramsey/uuid`) | Знать о существовании фреймворка (Symfony, Laravel) |
| Реализация бизнес-логики и инвариантов                     | Выполнять SQL-запросы или HTTP-вызовы               |
| Фабричные методы для создания сущностей                    | Бизнес-логика в конструкторах                       |

---

### ⚙️ 2. Application Layer (Сценарии использования)

Содержит **бизнес-логику уровня приложения** (Application Business Rules). Отвечает за как использовать Domain для выполнения конкретных сценариев (Use Cases).

**Состав:**
* Модули по доменным областям (`Voting/`, `Season/`, `Statistics/`, `Bot/`) — каждый содержит свои Command, Query, Handler, DTO
* `Command/` + `CommandHandler/` — синхронные use case, изменяющие состояние
* `Query/` + `QueryHandler/` — операции чтения
* `Message/` + `MessageHandler/` — асинхронная обработка через Symfony Messenger (не путать с CQRS Handler!)
* `Port/` — общие интерфейсы Application-слоя (имена `*Interface`, не `*Port`)
* `DTO/` — выходные объекты модулей
* `Exception/` — исключения уровня приложения (напр., EmployeeNotFoundException)

**📋 Правила:**

| ✅ РАЗРЕШЕНО                                    | ❌ ЗАПРЕЩЕНО                                 |
|:------------------------------------------------|:---------------------------------------------|
| Координировать работу Domain и Infrastructure   | Прямая работа с HTTP-запросами/ответами      |
| Вызывать репозитории и сервисы через интерфейсы | Прямые запросы к БД (SQL, DQL)               |
| Обрабатывать исключения и логировать контекст   | Содержать бизнес-логику вне UseCase/Handler  |
| Использовать паттерны (Saga, CQRS, Mediator)    | Знать о деталях реализации (Doctrine, Kafka) |
| Диспатчить команды в Message Bus                | Работать напрямую с очередями/брокерами      |

---

### 🔌 3. Infrastructure Layer (Детали реализации)

Самый внешний слой. Содержит **всё, что касается технических деталей:** базы данных, внешние API, очереди, фреймворки. Реализует интерфейсы, заданные в Domain и Application.

**Состав:**

* `Persistence/` — Работа с БД.
* `Model/` — ORM-сущности (Doctrine Models, Eloquent Models).
* `Mapper/` — Мапперы между Domain Entity и ORM Model.
* `Repository/` — Реализации интерфейсов из Domain\Repository.
* `Integration/` или `Api/` — HTTP-клиенты для внешних API.
* `Messaging/` или `Kafka/` — Интеграция с очередями (Kafka, RabbitMQ).
* `DI/` — Конфигурация контейнера внедрения зависимостей.
* `Serializer/` — Настройки сериализации/десериализации.
* `Validation/` — Валидаторы и правила валидации.
* `Console/` — Системные консольные команды, зависящие от фреймворка.

**📋 Правила:**

| ✅ РАЗРЕШЕНО                                   | ❌ ЗАПРЕЩЕНО                                   |
|:-----------------------------------------------|:-----------------------------------------------|
| Использовать Doctrine, Eloquent, PDO, Redis    | Содержать бизнес-логику (только техническая)   |
| Реализовывать интерфейсы из Domain/Application | Вызываться напрямую из Presentation слоя       |
| Работать с HTTP-клиентами, Kafka, SMTP         | Зависеть от Application или Presentation слоев |
| Конфигурировать фреймворк и DI-контейнер       |                                                |

---

### 🖥️ 4. Presentation Layer (Точки входа)

Слой драйверов. Отвечает за доставку запросов от пользователя/внешней системы в Application и возврат ответа. Должен быть максимально "тонким".

**Состав:**

* `Http/Controller/` — HTTP контроллеры (REST, GraphQL).
* `Http/Factory/` — маппинг Request DTO → Command/Query (для сложных случаев).
* `Http/DTO/Request/` — HTTP Request DTO с Symfony Validator constraints.
* `Console/Command/` — CLI-команды (бизнес-ориентированные).
* `Listener/` — Обработчики событий фреймворка.
* `Middleware/` — Проверки авторизации, валидация запросов.

**📋 Правила:**

| ✅ РАЗРЕШЕНО                                      | ❌ ЗАПРЕЩЕНО                            |
|:--------------------------------------------------|:----------------------------------------|
| Парсить HTTP-запросы, валидировать входные данные | Содержать бизнес-логику или оркестрацию |
| Создавать DTO/Command и передавать в Application  | Напрямую обращаться к Repository или БД |
| Форматировать HTTP-ответы (JSON, XML, HTML)       | Знать о деталях Infrastructure          |

---

### 🔄 Поток зависимостей и данных

#### Граф зависимостей (Кто от кого зависит)

```text
 ┌─────────────────────────────────────────────────┐
 │            Presentation Layer                   │
 │   (Controllers, CLI Commands, API Endpoints)    │
 └──────────────────────┬──────────────────────────┘
                        │ вызывает
                        ▼
 ┌─────────────────────────────────────────────────┐
 │            Application Layer                    │
 │   (UseCases, CommandHandlers, DTOs)             │
 └──────────────────────┬──────────────────────────┘
                        │ использует интерфейсы
                        ▼
 ┌─────────────────────────────────────────────────┐
 │              Domain Layer                       │
 │   (Entities, ValueObjects, Repository Contracts)│
 └───────────────────────▲─────────────────────────┘
                         │ реализует
 ┌───────────────────────┴─────────────────────────┐
 │           Infrastructure Layer                  │
 │   (ORM Models, Mappers, Repo Implementations,   │
 │    HTTP Clients, Message Brokers, DI Config)    │
 └─────────────────────────────────────────────────┘
```

#### Поток данных (На примере сохранения сущности)

1. **Presentation:** Принимает JSON, валидирует, создает `CreateUserCommand`, вызывает `CreateUserHandler`.
2. **Application:** CreateUserHandler получает команду. Вызывает `UserRepositoryInterface->save($user)`.
3. **Domain:** Ничего не знает о том, как данные уйдут в БД. Просто отдает сущность.
4. **Infrastructure:** `UserRepository` (реализация интерфейса) принимает Domain-сущность, через UserMapper конвертирует её в `UserModel` (ORM), сохраняет через `EntityManager`.

---

## 💡 Ключевые паттерны и концепции

### 1. Разделение Entity и Model (ORM)

Это частая ошибка — использовать ORM-модели как бизнес-сущности.

*    **Domain Entity:** Богатая модель, содержит бизнес-инварианты (например, `User->block()` проверяет правила блокировки). Не имеет аннотаций `#[ORM\Column]`.
*    **Infrastructure Model:** "Тупая" модель (Anemic), нужна только для маппинга на таблицу в БД. Содержит только геттеры/сеттеры и ORM-аннотации.
*    **Mapper:** Класс, который переводит Domain Entity ↔ Infrastructure Model.

### 2. Порты и Адаптеры в PHP (Ports and Adapters)

Архитектурный паттерн Ports and Adapters (Hexagonal Architecture) универсален, но PHP-сообщество исторически не использует слово Port в нейминге классов и директорий. Вместо этого применяются более описательные названия, отражающие суть контракта.

В PHP:
*    **Порт (Port)** — это **Интерфейс** (обычно с суффиксом `Interface`), описывающий контракт.
*    **Адаптер (Adapter)** — это **конкретный класс**, реализующий интерфейс и использующий технологии (Doctrine, Guzzle, Redis).

**Таблица соответствий терминов**

| Академический термин        | 🐘 Идиоматичный PHP-нейминг | Где размещается                              |
|:----------------------------|:----------------------------|:---------------------------------------------|
| `UserRepositoryPort`        | `UserRepositoryInterface`   | `Domain/Repository/`                         |
| `PaymentGatewayPort`        | `PaymentGatewayInterface`   | `Domain/Gateway/` или `Application/Service/` |
| `EmailSenderPort`           | `EmailSenderInterface`      | `Domain/Service/`                            |
| `ExternalApiClientPort`     | `SapClientInterface`        | `Infrastructure/Integration/`                |
| `UserManagementPort` (вход) | `CreateUserCommandHandler`  | `Application/CommandHandler/`                |
| `HttpApiPort` (вход)        | `UserController`            | `Presentation/Http/`                         |

**Почему в PHP не используют слово "Port"?**

1. **Слишком абстрактно.** PHP-разработчики предпочитают, чтобы имя класса сразу отвечало на вопрос "что это делает?". `SapClientInterface` говорит: "это интерфейс для общения с SAP". `SapPort` заставляет думать.
2. **Влияние фреймворков.** Symfony и Laravel популяризировали термины `Repository`, `Gateway`, `Client`, `Handler`. Они прочно вошли в стандарт индустрии.
3. **Screaming Architecture.** Архитектура должна "кричать" о предметной области, а не о паттернах. Директория `Infrastructure/Persistence/` кричит: "тут работа с базой!", а `Infrastructure/Adapter/` — "тут какой-то абстрактный адаптер".

**⚠️ Важно:** Избегайте создания директорий `Port/` и `Adapter/`. Используйте семантические имена: `Repository/`, `Gateway/`, `Client/`, `Sender/`, `Publisher/`, `Integration/`, `Persistence/`.

### 3. Иммутабельность и DTO

Все объекты, передающие данные между слоями (Commands, DTOs), должны быть неизменяемыми (readonly). Это гарантирует, что данные не будут изменены по пути от Presentation к Application, и упрощает потоковую безопасность.

---

## ⚖️ Плюсы и Минусы подхода

### ✅ Преимущества

* **Тестируемость:** Ядро (Domain) покрывается юнит-тестами на 100% без моков БД и фреймворка.
* **Поддерживаемость:** Четкое разделение ответственности. Разработчик точно знает, где писать бизнес-логику, а где код для работы с БД.
* **Гибкость:** Легко заменить БД (MySQL → PostgreSQL), фреймворк (Symfony → Laravel) или способ доставки (REST → GraphQL), не трогая ядро.
* **Независимость команд:** Можно параллельно разрабатывать ядро и инфраструктуру.

### ❌ Недостатки и Компромиссы

* **Boilerplate (много шаблонного кода):** Создание Entity, Model, Mapper, Repository Interface, Repository Implementation для одной сущности требует времени.
* **Порог входа:** Команде нужно строго соблюдать правила. Новички часто пытаются "срезать путь" и нарушают границы слоев.
* **Overkill для простых проектов:** Для простого CRUD-приложения Clean Architecture будет избыточной (лучше использовать Active Record или простую Service-ориентированную архитектуру).

---

## 🛡️ Чек-лист для Code Review

При ревью кода в проекте с Clean Architecture задавайте следующие вопросы:

1. Импортирует ли Domain слой что-либо из Symfony/Laravel/Doctrine? (Если да — ошибка)
2. Есть ли бизнес-логика (условия if/else, расчеты) в Infrastructure или Presentation слоях? (Если да — перенести в Domain/Application)
3. Обращается ли Presentation слой напрямую к Repository или БД? (Если да — перенести в Application UseCase)
4. Содержит ли Domain Entity аннотации ORM или зависимости от внешних сервисов? (Если да — вынести в Infrastructure)
5. Являются ли DTO и Command классы readonly?
6. Используются ли семантические имена для интерфейсов (Repository, Client, Sender), а не абстрактные Port/Adapter?
7. Реализует ли Infrastructure слой интерфейсы из Domain/Application через DI-контейнер?
8. Находится ли бизнес-логика внутри Entity/ValueObject/CommandHandler, а не в конструкторах и контроллерах?