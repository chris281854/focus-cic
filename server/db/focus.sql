CREATE TABLE IF NOT EXISTS "Users" (
    "user_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "birthdate" DATE,
    "last_name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(100) UNIQUE,
    "phone_number" VARCHAR(20) UNIQUE,
    "email" VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "Tasks" (
    "task_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(250),
    "category" VARCHAR(100) NOT NULL,
    "state" INT NOT NULL,
    "reminder_id" BIGINT,
    "due_date" DATE,
    "priority_level" INT NOT NULL DEFAULT 3,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Events" (
    "event_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "reminder_id" BIGINT,
    "state" INT NOT NULL,
    "end_date" TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "date" DATE,
    "priority_level" INT NOT NULL DEFAULT 3,
    "user_id" BIGINT NOT NULL,
    "description" VARCHAR(250),
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Goals" (
    "goal_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "target_date" DATE,
    "user_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(250),
    "category" VARCHAR(100),
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Reminders" (
    "reminder_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "mail" BOOLEAN NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Event_Reminder" (
    "event_id" BIGINT NOT NULL,
    "reminder_id" BIGINT NOT NULL,
    PRIMARY KEY ("event_id", "reminder_id"),
    FOREIGN KEY ("event_id") REFERENCES "Events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("reminder_id") REFERENCES "Reminders"("reminder_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Task_Reminder" (
    "task_id" BIGINT NOT NULL,
    "reminder_id" BIGINT NOT NULL,
    PRIMARY KEY ("task_id", "reminder_id"),
    FOREIGN KEY ("task_id") REFERENCES "Tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("reminder_id") REFERENCES "Reminders"("reminder_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Goal_Task" (
    "task_id" BIGINT NOT NULL,
    "goal_id" BIGINT NOT NULL,
    PRIMARY KEY ("goal_id", "task_id"),
    FOREIGN KEY ("task_id") REFERENCES "Tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("goal_id") REFERENCES "Goals"("goal_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Contacts" (
    "contact_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Task_Contact" (
    "task_id" BIGINT NOT NULL,
    "contact_id" BIGINT NOT NULL,
    PRIMARY KEY ("task_id", "contact_id"),
    FOREIGN KEY ("task_id") REFERENCES "Tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("contact_id") REFERENCES "Contacts"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Event_Contact" (
    "event_id" BIGINT NOT NULL,
    "contact_id" BIGINT NOT NULL,
    PRIMARY KEY ("event_id", "contact_id"),
    FOREIGN KEY ("event_id") REFERENCES "Events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("contact_id") REFERENCES "Contacts"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Google_Auth" (
    "user_id" BIGINT NOT NULL,
    "google_id" VARCHAR(100) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "token_update" VARCHAR NOT NULL,
    PRIMARY KEY ("google_id"),
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "User_Config" (
    "user_id" BIGINT NOT NULL PRIMARY KEY,
    "dark_mode" BOOLEAN NOT NULL,
    "time_settings" JSONB NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Task_List" (
    "task_list_id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "user_id" BIGINT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Task_List_Task" (
    "task_list_id" BIGINT NOT NULL,
    "task_id" BIGINT NOT NULL,
    PRIMARY KEY ("task_list_id", "task_id"),
    FOREIGN KEY ("task_list_id") REFERENCES "Task_List"("task_list_id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("task_id") REFERENCES "Tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE
);