DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments(
    id INT AUTO_INCREMENT,
    PRIMARY KEY(id),
    name VARCHAR(30)
);

CREATE TABLE roles(
    id INT AUTO_INCREMENT,
    PRIMARY KEY(id),
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees(
    id INT AUTO_INCREMENT,
    PRIMARY KEY(id),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO departments(name)
VALUES ("Sales"), ("Accounting"), ("Management");

INSERT INTO roles (title, salary, department_id)
VALUES ("Head of Sales", 50000, 1), ("Head of Accounting", 45000, 2), ("Branch Manager", 50001, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jim","Halpert", 1, 3), ("Oscar","Martinez", 2, 3), ("Michael","Scott", 3, 3);
