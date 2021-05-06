import sys 
sys.path.append("..")
from flask import Blueprint, Response, request
from model.dbconf import Connect
import json

attraction_api = Blueprint("attraction_api", __name__)
db = Connect()

@attraction_api.route("/attractions")
def attractions():
	page = int(request.args.get("page", 0))
	keyword = request.args.get("keyword", "")

	if keyword == "":
		sql = f"SELECT * FROM attraction ORDER BY id LIMIT {page * 12}, 12"
		result = db.query(sql)
	else:
		sql = f"SELECT * FROM attraction WHERE name LIKE '%{keyword}%' LIMIT {page * 12}, 12"
		result = db.query(sql)

	if len(result) != 0:
		data = []
		next_page = page + 1
		if len(result) < 12:
			next_page = None
		for record in result:
			# 圖片連結
			id = record[0]
			sql = f"SELECT url FROM image WHERE attr_id = {id}"
			img_url = db.query(sql)
			img = []
			for i in range(len(img_url)):
				img += list(img_url[i])
			# 景點資料
			data.append({
				"id": record[0],
				"name": record[1],
				"category": record[2],
				"description": record[3],
				"address": record[4],
				"transport": record[5],
				"mrt": record[6],
				"latitude": record[7],
				"longitude": record[8],
				"images": img
			})
			response = Response(
				response = json.dumps({"nextPage": next_page, "data": data}, sort_keys = False),
				status = 200,
				mimetype = "application/json"
			)
		return response
	else:
		response = Response(
			response = json.dumps({"error": True, "message": "查無此景點"}, sort_keys = False),
			status = 500,
			mimetype = "application/json"
		)
		return response

@attraction_api.route("/attraction/<attractionId>")
def attraction(attractionId):
	try:
		id = int(attractionId)
		# 根據景點編號取得資料
		sql = f"SELECT * FROM attraction WHERE id = {id}"
		result = db.query(sql)
		if len(result) != 0:
			result = result[0]
			sql = f"SELECT url FROM image WHERE attr_id = {id}"
			img_url = db.query(sql)
			# 圖片連結
			img = []
			for i in range(len(img_url)):
				img = img + list(img_url[i])
			data = {
				"id": result[0],
				"name": result[1],
				"category": result[2],
				"description": result[3],
				"address": result[4],
				"transport": result[5],
				"mrt": result[6],
				"latitude": result[7],
				"longitude": result[8],
				"images": img
			}
			response = Response(
				response = json.dumps({"data": data}, sort_keys = False),
				status = 200,
				mimetype = "application/json"
			)
			return response
		else:
			response = Response(
				response = json.dumps({"error": True,"message": "自訂的錯誤訊息"}, sort_keys = False),
				status = 500,
				mimetype = "application/json"
			)
			return response
	except:
		response = Response(
			response = json.dumps({"error": True,"message": "景點編號不正確"}, sort_keys = False),
			status = 400,
			mimetype = "application/json"
		)
		return response