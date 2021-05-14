import sys 
sys.path.append("..")
from flask import Blueprint, request, make_response, jsonify
from model.attraction_data import *

attraction_api = Blueprint("attraction_api", __name__)

@attraction_api.route("/attractions")
def attractions_list():
	try:
		page = int(request.args.get("page"))
		keyword = request.args.get("keyword", "")
		response = get_attractions_list(page, keyword)
		return response
	except Exception as e:
		print(e, "ERROR in routes.attraction.attraction_list()")
		response = make_response(jsonify({"error": True,"message": "輸入資料格式錯誤"}), 400)
		return response

@attraction_api.route("/attraction/<attractionId>")
def attraction(attractionId):
	try:
		id = int(attractionId)
		response = get_attraction(id)
		return response
	except Exception as e:
		print(e, "ERROR in routes.attraction.attraction()")
		response = make_response(jsonify({"error": True,"message": "輸入資料格式錯誤"}), 400)
		return response