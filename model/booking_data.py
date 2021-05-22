from logging import makeLogRecord
import sys
from flask.globals import request
sys.path.append("..")
from dbconf import Connect
from flask import make_response, jsonify
db = Connect()

def create_booking_data(attraction_id, date, time, price):
    try:
        id = request.cookies.get("sessionId")
        sql = f"""
                INSERT INTO booking (attraction_id, date, time, price, uid)
                VALUES ({attraction_id}, '{date}', '{time}', {price}, '{id}')
            """
        result = db.insert(sql)
        if result == "insert success":
                response = make_response(jsonify({"ok": True}), 200)
                return response
        if result == "MySQL connection error":
            # 已有預定行程
            response = make_response(jsonify({"error": True, "message": "建立失敗，輸入不正確或其他原因"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in model.booking_data.create_booking_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

def get_booking_data():
    try:
        id = request.cookies.get("sessionId")
        sql = f"""
                SELECT attraction_id, date, time, price
                FROM booking
                WHERE uid = '{id}'
            """
        result = db.query(sql)
        if result:
            attraction_id = result[0][0]
            date = result[0][1]
            time = result[0][2]
            price = result[0][3]
            # 景點資料
            sql = f"""
                    SELECT name, address
                    FROM attraction
                    WHERE id = {attraction_id}
                """
            result = db.query(sql)
            name = result[0][0]
            address = result[0][1]
            # 景點圖片
            sql = f"""
                    SELECT url 
                    FROM image
                    WHERE attr_id = {attraction_id}
                """
            result = db.query(sql)
            image = result[0][0]
            data = {
                "data": {
                    "attraction": {
                        "id": attraction_id,
                        "name": name,
                        "address": address,
                        "image": image
                    },
                    "date": date,
                    "time": time,
                    "price": price
                }
            }
            response = make_response(jsonify(data), 200)
            return response
        # 沒有預定資料
        else:
            response = make_response(jsonify({"data": None}), 200)
            return response
    except Exception as e:
        print(e, "ERROR in model.booking_data.get_booking_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

def delete_booking_data(id):
    try:
        sql = f"""
                DELETE FROM booking
                WHERE uid = '{id}'
            """
        result = db.delete(sql)
        if result == "delete success":
            response = make_response(jsonify({"ok": True}), 200)
            return response
        if result == "MySQL connection error":
                response = make_response(jsonify({"error": True, "message": "資料庫連線失敗"}), 500)
                return response
    except Exception as e:
        print(e, "ERROR in model.booking_data.get_booking_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response