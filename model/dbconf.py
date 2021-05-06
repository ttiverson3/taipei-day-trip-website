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
            # print("MySQL connect success!")
            return self.result
        except Exception as e:
            print("MySQL connect error!", e)

    def get_attractions_list(self, page, keyword):
        if keyword == "":
            sql = f"SELECT * FROM attraction ORDER BY id LIMIT {page * 12}, 12"
        else:
            sql = f"SELECT * FROM attraction WHERE name LIKE '%{keyword}%' LIMIT {page * 12}, 12"
        self.result = self.query(sql)
        return self.result


    def get_img_urls(self, attraction_id):
        sql = f"SELECT url FROM image WHERE attr_id = {attraction_id}"
        self.result = self.query(sql)
        return self.result

    def get_attraction(self, id):
        sql = f"SELECT * FROM attraction WHERE id = {id}"
        self.result = self.query(sql)
        if self.result != []:
            return self.result[0]
        else:
            return self.result