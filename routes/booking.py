import sys
sys.path.append("..")
from flask import Blueprint, request, make_response, jsonify, redirect, url_for
from routes.user import get_user_info
from model.booking_data import *


booking_api = Blueprint("booking_api", __name__)

@booking_api.route("/booking", methods = ["GET"])
def get_booking():
    try:
        # 取得使用者登入資訊
        sessionId = request.cookies.get("sessionId")
        # 已登入
        if sessionId:
            response = get_booking_data()
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403)
            return response
    except Exception as e:
        print(e, "ERROR in routes.get_booking()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

@booking_api.route("/booking", methods = ["POST"])
def create_booking():
    try:
        sessionId = request.cookies.get("sessionId")
        if sessionId:
            attraction_id = int(request.get_json()["attractionId"])
            date = request.get_json()["date"]
            time = request.get_json()["time"]
            price = int(request.get_json()["price"])
            response = create_booking_data(attraction_id, date, time, price)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403)
            return response
    except Exception as e:
        print(e, "ERROR in routes.create_booking()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

@booking_api.route("/booking", methods = ["DELETE"])
def delete_booking():
    try:
        sessionId = request.cookies.get("sessionId")
        if sessionId:
            id = request.cookies.get("sessionId")
            response = delete_booking_data(id)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403)
            return response
    except Exception as e:
        print(e, "ERROR in routes.delete_booking()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response


