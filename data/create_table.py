import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

def create_table():
    mydb = mysql.connector.connect(
        host = "localhost",
        user = os.getenv("user"),
        password = os.getenv("password"),
        database = "test",
        auth_plugin = "mysql_native_password"
    )
    cursor = mydb.cursor()
    # cursor.execute("""CREATE TABLE attraction 
    # (id INT AUTO_INCREMENT PRIMARY KEY, 
    # name VARCHAR(255), 
    # category VARCHAR(255),
    # description VARCHAR(5000),
    # address VARCHAR(255),
    # transport VARCHAR(5000),
    # mrt VARCHAR(255),
    # latitude float,
    # longitude float
    # )""")
    # cursor.execute("""CREATE TABLE image 
    # (img_id INT AUTO_INCREMENT PRIMARY KEY, 
    # url VARCHAR(255), 
    # attr_id INT,
    # FOREIGN KEY(attr_id) REFERENCES attraction(id)
    # )""")
    cursor.execute("""CREATE TABLE user 
    (id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (id, email)
    )""")
    cursor.execute("""create table cookie
    ( id int not null, 
    uid varchar(255) not null, 
    account varchar(255) not null, 
    expires_time int not null, 
    primary key(id, uid), 
    foreign key (id) references user(id));
    """)
    print("success")

create_table()