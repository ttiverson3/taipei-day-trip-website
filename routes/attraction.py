import sys 
sys.path.append("..")
from flask import Blueprint, Response, request
from model.dbconf import Connect
import json

attraction_api = Blueprint("attraction_api", __name__)
db = Connect()

@attraction_api.route("/attractions")
def attractions_list():
	page = int(request.args.get("page", 0))
	keyword = request.args.get("keyword", "")
	result = db.get_attractions_list(page, keyword)

	if result != []:
		data = []
		next_page = page + 1
		if len(result) < 12:
			next_page = None
		for record in result:
			# 圖片連結
			id = record[0]
			img_urls = db.get_img_urls(id)
			url_list = [url for tup_url in img_urls for url in tup_url]
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
				"images": url_list
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
		# 根據編號取得景點資料
		result = db.get_attraction(id)
		if result != []:
			id = result[0]
			img_urls = db.get_img_urls(id)
			# 圖片連結
			url_list = [url for tup_url in img_urls for url in tup_url]
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
				"images": url_list
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