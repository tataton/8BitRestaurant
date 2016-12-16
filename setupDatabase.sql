CREATE TABLE employees (
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR (50) UNIQUE,
    last_name VARCHAR (50) UNIQUE
);

CREATE TABLE tabletops (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR (50) UNIQUE,
    capacity INTEGER,
    status VARCHAR (50) DEFAULT 'empty',
    employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL
);

SELECT * from tabletops
LEFT JOIN employees
ON employees.id = tabletops.employee_id;
