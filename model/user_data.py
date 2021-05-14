import sys
sys.path.append("..")
from dbconf import Connect
from flask import make_response, jsonify
import hashlib
import secrets
import time
db = Connect()

# 登入
def do_login(uid, email, password):
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
            uid = str(secrets.token_hex(16))
            account = email
            expires_time = int(time.time() + 30 * 60)
            sql = f"""
                    INSERT INTO cookie (id, uid, account, expires_time)
                    VALUES ({id}, '{uid}', '{account}', {expires_time})
                    """
            cookie_result = db.insert(sql)
            if cookie_result == "insert success":
                response = make_response(jsonify({"ok": True}), 200)
                response.set_cookie(key = "uid", value = uid, httponly = True, expires = expires_time)
                return response
            else:
                response = make_response(jsonify({"error": True, "message": "資料庫連線失敗"}), 500)
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
        sql = f"""
                INSERT INTO user (name, email, password)
                VALUES ('{name}', '{email}', '{password}')
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
def do_logout(uid):
    try:
        sql = f"""
                DELETE FROM cookie
                WHERE uid = '{uid}'
            """
        result = db.delete(sql)
        if result == "delete success":
            response = make_response(jsonify({"ok": True}), 200)
            response.set_cookie(key = "uid", value = "", expires = 0)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "資料庫連線失敗"}), 500)
            return response
    except Exception as e:
        print(e, "ERROR in model.user_data.do_logout()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 取得使用者資料
def get_info_data(uid):
    try:
        sql = f"""
                SELECT id, uid, expires_time
                FROM cookie
                WHERE uid = '{uid}'
            """
        cookie_result = db.query(sql)
        if cookie_result:
            expires_time = cookie_result[0][2]
            if expires_time > int(time.time()):
                id = cookie_result[0][0]
                sql = f"""
                        SELECT name, email
                        FROM user
                        WHERE id = {id}
                    """
                result = db.query(sql)
                name = result[0][0]
                email = result[0][1]
                data = {
                    "data":{
                        "id": uid,
                        "name": name,
                        "email": email
                    }
                }
                response = make_response(jsonify(data), 200)
                return response
            # cookie 超過期限
            if expires_time < int(time.time()):
                response = make_response(jsonify({"data": None}), 200)
                response.set_cookie(key = "uid", value = "", expires = 0)
                return response
        if cookie_result == []:
            response = make_response(jsonify({"error": True, "message": "cookie 資料錯誤"}), 400)
            response.set_cookie(key = "uid", value = "", expires = 0)
            return response
    except Exception as e:
        print(e, "ERROR in model.user_data.get_info_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response