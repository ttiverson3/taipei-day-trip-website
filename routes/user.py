import sys
sys.path.append("..")
from flask import Blueprint, request, make_response, jsonify, redirect, url_for
from model.user_data import *

user_api = Blueprint("user_api", __name__)

# 登入
@user_api.route("/user", methods = ["PATCH"])
def login():
    try:
        email = request.get_json()["email"]
        password = request.get_json()["password"]
        if email and password:
            response = do_login(email, password)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "請輸入帳號及密碼"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in routes.user.login()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 註冊
@user_api.route("/user", methods = ["POST"])
def register():
    try:
        name = request.get_json()["name"]
        email = request.get_json()["email"]
        password = request.get_json()["password"]
        if name and email and password:
            response = do_register(name, email, password)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "請輸入姓名、帳號及密碼"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in routes.user.register()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 登出
@user_api.route("/user", methods = ["DELETE"])
def logout():
    try:
        uid = request.cookies.get("uid")
        if uid:
            response = do_logout(uid)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "沒有取得 cookie"}), 400)
            return response
            # return redirect(url_for("/"))
    except Exception as e:
        print(e, "ERROR in routes.user.logout()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

# 取得當前使用者資訊
@user_api.route("/user", methods = ["GET"])
def get_user_info():
    try:
        uid = request.cookies.get("uid")
        if uid == None:
            response = make_response(jsonify({"data": None}), 200)
            return response
        if uid != None:
            response = get_info_data(uid)
            return response
    except Exception as e:
        print(e, "ERROR in routes.user.get_user_info()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response