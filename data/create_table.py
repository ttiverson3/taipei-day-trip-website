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
    cursor.execute("""CREATE TABLE attraction 
    (id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255), 
    category VARCHAR(255),
    description VARCHAR(5000),
    address VARCHAR(255),
    transport VARCHAR(5000),
    mrt VARCHAR(255),
    latitude float,
    longitude float
    )""")
    cursor.execute("""CREATE TABLE image 
    (img_id INT AUTO_INCREMENT PRIMARY KEY, 
    url VARCHAR(255), 
    attr_id INT,
    FOREIGN KEY(attr_id) REFERENCES attraction(id)
    )""")
    print("success")

create_table()