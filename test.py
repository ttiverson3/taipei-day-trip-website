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
            INSERT INTO orders(oid, uid, aid, image, phone, price, date, time, status)
            VALUES ('1', '87924606b4131a8aceeeae8868531fbb9712aaa07a5d3a756b26ce0f5d6ca674', '1', '1', '1', '1', '1', '1', false)
    """
#     result = db.insert(sql)
#     print(result)
    sql = f"""
            SELECT o.oid, o.price, a.id, a.name, a.address, o.image, o.date, o.time, u.name, u.email, o.phone, o.status
            FROM user as u, attraction as a, orders as o
            WHERE oid = '1' AND u.id = o.uid AND a.id = o.aid 
        """
    result = db.query(sql)
    print(result)
    # r = get_info_data("34bbb35ea9dcd89ab1f4650dc57c157c")
    # print(type(r.status_code))
