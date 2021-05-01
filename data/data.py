import json
import mysql.connector
import re
import os
from dotenv import load_dotenv
load_dotenv()

with open("taipei-attractions.json", "r", encoding = "utf-8") as f:
    data = json.load(f)["result"]["results"]

mydb = mysql.connector.connect(
    host = "localhost",
    user = os.getenv("user"),
    password = os.getenv("password"),
    database = "taipei",
    auth_plugin = "mysql_native_password"
)
mycursor = mydb.cursor(buffered = True)

for item in data:
    sql = """insert into attraction 
            (id, name, category, description, address, transport, mrt, latitude, longitude)
            values (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    val = (item["_id"], item["stitle"], item["CAT2"], item["xbody"], item["address"], item["info"], item["MRT"], item["latitude"], item["longitude"])
    mycursor.execute(sql, val)
    mydb.commit()

    img_url = re.findall(r".*?\.(?:jpg|JPG|png|PNG)", item["file"])
    for url in img_url:
        sql = """insert into image
                (attr_id, url)
                values (%s, %s)"""
        val = (item["_id"], url)
        mycursor.execute(sql, val)
        mydb.commit()


