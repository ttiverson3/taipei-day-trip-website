import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv
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
        try:
            self.cnxpool = mysql.connector.pooling.MySQLConnectionPool(
                pool_name = "mypool",
                pool_size = 10,
                pool_reset_session = True,
                **self.dbconfig
            )
            # self.cnx = self.cnxpool.get_connection()
            # self.cur = self.cnx.cursor(buffered = True)
            print("MySQL connect success!")
        except Exception as e:
            print("MySQL connect error!", e)

    def query(self, sql):
        self.cnx = self.cnxpool.get_connection()
        self.cur = self.cnx.cursor(buffered = True)
        
        self.cur.execute(sql)
        self.result = self.cur.fetchall()
        
        self.cur.close()
        self.cnx.close()
        # print("MySQL connection is closed")
        return self.result