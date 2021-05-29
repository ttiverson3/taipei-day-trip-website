import sys
sys.path.append("..")
import os
from dotenv import load_dotenv
from requests.api import request
from requests.sessions import session
load_dotenv()
import requests
import json
from flask import request, make_response, jsonify
from datetime import datetime
from dbconf import Connect
db = Connect()

def make_order_data(order_data):
    try:
        uid = request.cookies.get("sessionId")
        oid = str(datetime.today()).replace("-", "").replace(" ", "").replace(":", "").split(".")[0]
        aid = order_data["order"]["trip"]["attraction"]["id"]
        image = order_data["order"]["trip"]["attraction"]["image"]
        phone = order_data["order"]["contact"]["phone"]
        price = order_data["order"]["price"]
        date = order_data["order"]["trip"]["date"]
        time = order_data["order"]["trip"]["time"]
        status = 0
        sql = f"""
                INSERT INTO orders(oid, uid, aid, image, phone, price, date, time, status)
                VALUES ('{oid}', '{uid}', {aid}, '{image}', '{phone}', '{price}', '{date}', '{time}', {status})
        """
        result = db.insert(sql)
        if result == "insert success":
            prime = order_data["prime"]
            partner_key = os.getenv("partner_key")
            phone = order_data["order"]["contact"]["phone"]
            email = order_data["order"]["contact"]["email"]
            name = order_data["order"]["contact"]["name"]
            amount = order_data["order"]["price"]
            # Pay By Prime
            data = {
                "prime": prime,
                "partner_key": partner_key,
                "merchant_id": "gary_CTBC",
                "details":"台北一日遊",
                "amount": amount,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email": email,
                }
            }
            # tappay testing api
            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            headers = {
                "Content-Type": "application/json",
                "x-api-key": os.getenv("partner_key")
            }
            r = requests.post(url = url, data = json.dumps(data, sort_keys = False), headers = headers).json()
            if r["status"] == 0:
                sql = f"""
                        UPDATE orders
                        SET status = 1
                        WHERE uid = '{uid}' AND oid = '{oid}'
                """
                result = db.update(sql)
                if result == "update success":
                    data = {
                        "data": {
                            "number": oid,
                            "payment": {
                            "status": r["status"],
                            "message": "付款成功"
                            }
                        }
                    }
                    response = make_response(jsonify(data), 200)
                    return response
            else:
                response = make_response(jsonify({"error": True, "message": "付款失敗，輸入不正確或其他原因"}), 400)
                return response
        if result == "MySQL connection error":
            response = make_response(jsonify({"error": True, "message": "訂單建立失敗，輸入不正確或其他原因"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in model.order_data.make_order_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response

def get_order_data(orderNumber):
    try:
        sql = f"""
                SELECT o.oid, o.price, a.id, a.name, a.address, o.image, o.date, o.time, u.name, u.email, o.phone, o.status
                FROM user as u, attraction as a, orders as o
                WHERE oid = '{orderNumber}' AND u.id = o.uid AND a.id = o.aid 
            """
        result = db.query(sql)
        if result:
            result = result[0]
            number = result[0]
            price = int(result[1])
            attraction_id = int(result[2])
            attraction_name = result[3]
            attraction_address = result[4]
            attraction_image = result[5]
            date = result[6]
            time = result[7]
            user_name = result[8]
            email = result[9]
            phone = result[10]
            status = result[11]
            data = {
                "data": {
                    "number": number,
                    "price": price,
                    "trip": {
                    "attraction": {
                        "id": attraction_id,
                        "name":  attraction_name,
                        "address": attraction_address,
                        "image": attraction_image
                    },
                    "date": date,
                    "time": time
                    },
                    "contact": {
                    "name": user_name,
                    "email": email,
                    "phone": phone
                    },
                    "status": status
                }
            }
            response = make_response(jsonify(data), 200)
            return response
    except Exception as e:
        print(e, "ERROR in model.order_data.get_order_data()")
        response = make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}), 500)
        return response
