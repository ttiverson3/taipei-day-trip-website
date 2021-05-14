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
db = Connect()

app = Flask(__name__)
with app.app_context():
    sql = f"""
                SELECT id, uid
                FROM cookie
                WHERE uid = '1'
            """
    # r = do_login("test@gmail.com", "test")
    # print(r)
    # print(int(time.time() + 30 * 60))
    r = get_info_data("34bbb35ea9dcd89ab1f4650dc57c157c")
    print(r)
    # r = get_info_data("34bbb35ea9dcd89ab1f4650dc57c157c")
    # print(type(r.status_code))
