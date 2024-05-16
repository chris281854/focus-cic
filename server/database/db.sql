CREATE DATABASE focus
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  user_app VARCHAR(50)
	
);

CREATE TABLE eventos (
  id SERIAL PRIMARY KEY,
  evento VARCHAR(100),
  tipo_evento VARCHAR(100),
  id_usuario VARCHAR(50),
   event_date date,
   modify_date date
	
);