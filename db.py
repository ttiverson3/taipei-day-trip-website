import mysql.connector
import os

file = os.path.join(os.getcwd(), "file.txt")
with open(file, "r") as f:
            user, password = f.readline().split(",")

class Connect:
    def __init__(self):
        self.dbconfig = {
            "host": "localhost",
            "user": user,
            "password": password,
            "database": "taipei"
        }
        try:
            self.conn = mysql.connector.connect(**self.dbconfig)
            self.cur = self.conn.cursor(buffered = True)
            print('mysql conn success!')
        except:
            print("mysql conn error!")

    def query(self, sql):
        self.cur.execute(sql)
        self.result = self.cur.fetchall()
        return self.result