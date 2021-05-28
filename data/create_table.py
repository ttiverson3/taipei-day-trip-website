import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

def create_table():
    mydb = mysql.connector.connect(
        host = "localhost",
        user = os.getenv("user"),
        password = os.getenv("password"),
        database = "taipei",
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
    # cursor.execute("""CREATE TABLE user 
    # (id VARCHAR(255) AUTO_INCREMENT PRIMARY KEY, 
    # name VARCHAR(255) NOT NULL, 
    # email VARCHAR(255) NOT NULL UNIQUE,
    # password VARCHAR(255) NOT NULL,
    # )""")
    # cursor.execute("""CREATE TABLE booking 
    # (
    # attraction_id INT NOT NULL, 
    # date VARCHAR(255) NOT NULL,
    # time VARCHAR(255) NOT NULL,
    # price INT NOT NULL,
    # uid VARCHAR(255) NOT NULL UNIQUE,
    # PRIMARY KEY(attraction_id, uid),
    # FOREIGN KEY(attraction_id) REFERENCES attraction(id),
    # FOREIGN KEY(uid) REFERENCES user(id)
    # )""")
    cursor.execute("""CREATE TABLE orders 
    (
    oid VARCHAR(255)NOT NULL, 
    uid VARCHAR(255) NOT NULL,
    aid INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    status BOOLEAN,
    PRIMARY KEY(oid),
    FOREIGN KEY(uid) REFERENCES user(id),
    FOREIGN KEY(aid) REFERENCES attraction(id)
    )""")
    print("success")

create_table()