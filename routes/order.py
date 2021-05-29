import sys
sys.path.append("..")
from flask import Blueprint, request, make_response, jsonify
from model.order_data import *

order_api = Blueprint("order_api", __name__)

@order_api.route("/orders", methods = ["POST"])
def make_order():
    try:
        sessionId = request.cookies.get("sessionId")
        if sessionId:
            order_data = request.get_json()
            # print(order_data)
            response = make_order_data(order_data)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403)
            return response
    except Exception as e:
        print(e, "ERROR in routes.order.make_order()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

@order_api.route("/order/<orderNumber>", methods = ["GET"])
def get_order(orderNumber):
    try:
        sessionId = request.cookies.get("sessionId")
        if sessionId:
            response = get_order_data(orderNumber)
            return response
        else:
            response = make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403)
            return response
    except Exception as e:
        print(e, "ERROR in routes.order.get_order()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response
