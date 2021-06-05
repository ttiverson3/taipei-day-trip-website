# 測試用
from flask import *
from dbconf import Connect
from routes.attraction import  *
from model.attraction_data import *
from routes.user import *
from model.user_data import *
import os
import secrets
import time
import datetime
import hashlib
import secrets
from datetime import datetime

db = Connect()

app = Flask(__name__)
with app.app_context():
    sql = f"""
                SELECT *
                FROM orders
                WHERE uid = '87924606b4131a8aceeeae8868531fbb9712aaa07a5d3a756b26ce0f5d6ca674'
                ORDER BY oid
                LIMIT 0, 30
            """
    result = db.query(sql)
    print(result[0])
