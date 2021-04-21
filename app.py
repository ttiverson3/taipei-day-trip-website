from flask import *
from db import *

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
db = Connect()

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# API
@app.route("/api/attractions")
def attractions():
	page = int(request.args.get("page", 0))
	start = page * 12 + 1
	keyword = request.args.get("keyword", "")

	if keyword == "":
		sql = f"SELECT * FROM attraction WHERE id BETWEEN {start} AND {start + 11}"
		result = db.query(sql)
	else:
		sql = f"SELECT * FROM attraction WHERE name LIKE '%{keyword}%' LIMIT {start - 1}, 12"
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
			response = app.response_class(
				response = json.dumps({"nextPage": next_page, "data": data}, sort_keys = False),
				status = 200,
				mimetype = "application/json"
			)
		return response
	else:
		response = app.response_class(
			response = json.dumps({"error": True,"message": "自訂的錯誤訊息"}, sort_keys = False),
			status = 500,
			mimetype = "application/json"
		)
		return response

@app.route("/api/attraction/<attractionId>")
def attractionId(attractionId):
	id = attractionId
	try:
		int(id)
	except:
		response = app.response_class(
			response = json.dumps({"error": True,"message": "景點編號不正確"}, sort_keys = False),
			status = 400,
			mimetype = "application/json"
		)
		return response
	
	sql = f"SELECT url FROM image WHERE attr_id = {id}"
	img_url = db.query(sql)
	if len(img_url) != 0:
		# 圖片連結
		img = []
		for i in range(len(img_url)):
			img = img + list(img_url[i])
		# 根據景點編號取得資料
		sql = f"SELECT * FROM attraction WHERE id = {id}"
		result = db.query(sql)[0]
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
		response = app.response_class(
			response = json.dumps({"data": data}, sort_keys = False),
			status = 200,
			mimetype = "application/json"
		)
		return response
	else:
		response = app.response_class(
			response = json.dumps({"error": True,"message": "自訂的錯誤訊息"}, sort_keys = False),
			status = 500,
			mimetype = "application/json"
		)
		return response


app.run(host="0.0.0.0", port=3000)