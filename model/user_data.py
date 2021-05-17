import sys
from flask.globals import request
sys.path.append("..")
from dbconf import Connect
from flask import make_response, jsonify
import hashlib
import time
db = Connect()

# 登入
def do_login(email, password):
    try:
        password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        sql = f"""
                SELECT id
                FROM user 
                WHERE email = '{email}' AND password = '{password}'
            """
        result = db.query(sql)
        if result == "MySQL connection error":
            response = make_response(jsonify({"error": True, "message": "資料庫連線失敗"}), 500)
            return response
        if result:
            id = result[0][0]
            response = make_response(jsonify({"ok": True}), 200)
            expires_time = time.time() + 60 * 20
            response.set_cookie(key = "sessionId", value = id, httponly = True, expires = expires_time)
            return response
        if result == []:
            response = make_response({"error": True, "message": "請輸入正確的帳號或密碼"}, 400)
            return response
    except Exception as e:
        print(e, "ERROR in model.user_data.do_login()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 註冊
def do_register(name, email, password):
    try:
        password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        id = hashlib.sha256(email.encode("utf-8")).hexdigest()
        sql = f"""
                INSERT INTO user (id, name, email, password)
                VALUES ('{id}' ,'{name}', '{email}', '{password}')
            """
        result = db.insert(sql)
        if result == "insert success":
            response = make_response(jsonify({"ok": True}), 200)
            return response
        if result == "MySQL connection error":
            response = make_response(jsonify({"error": True, "message": "註冊失敗，重複的 Email 或其他原因"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in model.user_data.do_register()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 登出
def do_logout(cookie):
    try:
        if cookie:
            response = make_response(jsonify({"ok": True}), 200)
            response.set_cookie(key = "sessionId", value = "", expires = 0)
            return response
    except Exception as e:
        print(e, "ERROR in model.user_data.do_logout()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 取得使用者資料
def get_info_data(cookie):
    try:
        if cookie:
            id = cookie
            sql = f"""
                    SELECT name, email
                    FROM user
                    WHERE id = '{id}'
                """
            result = db.query(sql)
            name = result[0][0]
            email = result[0][1]
            data = {
                "data":{
                    "id": id,
                    "name": name,
                    "email": email
                }
            }
            response = make_response(jsonify(data), 200)
            return response
        # cookie 超過期限
        if cookie == None:
            response = make_response(jsonify({"data": None}), 200)
            response.set_cookie(key = "sessionId", value = "", expires = 0)
            return response
    except Exception as e:
        print(e, "ERROR in model.user_data.get_info_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response