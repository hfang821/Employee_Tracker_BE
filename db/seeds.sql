INSERT INTO department(name)
VALUES
('UI'),
('UX'),
('QA'),
('Cloud'),
('Backend'),
('Devops');

INSERT INTO role (title, salary, department_id)
VALUES
('Frontend engineer','50000',1),
('Frontend engineer','55000',1),
('Frontend engineer','59000',2),
('Frontend engineer','70000',2),
('Backend engineer','50000',5),
('Backend engineer','80000',5),
('Backend engineer','70000',5),
('Backend engineer','59000',5),
('QA engineer','40000',3),
('QA engineer','70000',3),
('Cloud Engineer','150000',4),
('AWS engineer','100000',4),
('Azure Engineer','80000',4),
('DevOps engineer','70000',6),
('DevOps engineer','90000',6),
('DevOps engineer','100000',6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Kevin','Fang',1,null),
('John','Smith',2,null),
('Jason','Leng',3,null),
('Mike','Balazic',4,null),
('Yomi','Abdulsi',5,1),
('Ken','Yen',6,null),
('William','Li',7,null),
('Wu','Jin',8,null),
('Hao','Qin',9,null),
('Kobe','Brown',10,null),
('Ginger','Martin',11,null),
('Jade','Hu',12,null),
('Jona','Ford',13,null),
('Lexi','Novikov',14,null),
('Brian','Shaw',15,null),
('Bell','Joe',16,null),
('Bella','Fang',1,null),
('John','Smith',2,null),
('Jason','Leng',3,null),
('Mike','Balazic',4,null),
('Yomi','Abdulsi',5,null),
('Ken','Yen',6,null),
('Will','Li',7,null),
('Wall','Jin',8,null),
('Hao','Han',9,null),
('Jobe','Brown',10,null),
('Kinger','Martin',11,null),
('Jaden','Hu',12,null),
('Martyn','Ford',13,null),
('The','Rock',14,null),
('John','Shaw',15,null),
('Goose','Bent',16,null);

