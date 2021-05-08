import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv
import math
load_dotenv()

class Connect:
    def __init__(self):
        self.dbconfig = {
            "host": "localhost",
            "user": os.getenv("user"),
            "password": os.getenv("password"),
            "database": "taipei",
            "auth_plugin": "mysql_native_password"
        }
        self.cnxpool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name = "mypool",
            pool_size = 10,
            pool_reset_session = True,
            **self.dbconfig
        )
    def query(self, sql):
        try:
            # connect to database
            self.cnx = self.cnxpool.get_connection()
            self.cur = self.cnx.cursor(buffered = True)
            # execute query
            self.cur.execute(sql)
            self.result = self.cur.fetchall()
            # close database connection
            self.cur.close()
            self.cnx.close()
            return self.result
        except:
            return "MySQL connection error"
