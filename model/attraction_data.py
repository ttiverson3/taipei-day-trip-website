import sys
sys.path.append("..")
from dbconf import Connect
from flask import make_response, jsonify
import math
db = Connect()

def get_attraction_dict(record):
    url_list = get_img_urls(record[0])
    data = {
        "id": record[0],
        "name": record[1],
        "category": record[2],
        "description": record[3],
        "address": record[4],
        "transport": record[5],
        "mrt": record[6],
        "latitude": record[7],
        "longitude": record[8],
        "images": url_list
    }
    return data

def get_img_urls(attraction_id):
    sql = f"SELECT url FROM image WHERE attr_id = {attraction_id}"
    result = db.query(sql)
    url_list = [url for tup_url in result for url in tup_url]
    return url_list

def get_attractions_list(page, keyword):
    try:
        sql = f"SELECT * FROM attraction WHERE name LIKE '%{keyword}%' LIMIT {page * 12}, 12"
        result = db.query(sql)
        sql = f"SELECT COUNT(*) FROM attraction WHERE name LIKE '%{keyword}%'"
        nrow = db.query(sql)
        if result == "MySQL connection error" or nrow == "MySQL connection error":
            response = make_response(jsonify({"error": True, "message": "資料庫連線失敗"}), 500)
            return response
        elif result != []:
            data = []
            total_pages = math.ceil(int(nrow[0][0]) / 12) - 1
            next_page = page + 1
            if next_page > total_pages:
                next_page = None
            for record in result:
                data.append(get_attraction_dict(record))
                response = make_response(jsonify({"nextPage": next_page, "data": data}), 200)
            return response
        else:
            response = make_response(jsonify({"error": True,"message": "景點編號或關鍵字不正確"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in model.attraction_data.get_attraction_list()")
        response = make_response(jsonify({"error": True,"message": "伺服器內部錯誤"}), 500)
        return response

def get_attraction(id):
    try:
        sql = f"SELECT * FROM attraction WHERE id = {id}"
        result = db.query(sql)
        if result == "MySQL connection error":
            response = make_response(jsonify({"error": True, "message": "資料庫連線失敗"}), 500)
            return response
        elif result != []:
            data = get_attraction_dict(result[0])
            response = make_response(jsonify({"data": data}), 200)
            return response
        else:
            response = make_response(jsonify({"error": True,"message": "景點編號不正確"}), 400)
            return response
    except Exception as e:
        print(e, "ERROR in model.attraction_data.get_attraction()")
        response = make_response(jsonify({"error": True,"message": "伺服器內部錯誤"}), 500)
        return response