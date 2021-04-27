import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

class Connect:
    def __init__(self):
        self.dbconfig = {
            "host": "localhost",
            "user": os.getenv("user"),
            "password": os.getenv("password"),
            "database": "taipei"
        }
        try:
            self.conn = mysql.connector.connect(**self.dbconfig)
            self.cur = self.conn.cursor(buffered = True)
            print("mysql connect success!")
        except:
            print("mysql connect error!")

    def query(self, sql):
        self.cur.execute(sql)
        self.result = self.cur.fetchall()
        return self.result