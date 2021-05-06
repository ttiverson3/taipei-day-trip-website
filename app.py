from flask import *
from routes.attraction import attraction_api

app = Flask(
	__name__,
	static_url_path= "/",
	static_folder = "static"
)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

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

# APIs
# Attraction APIs
app.register_blueprint(attraction_api, url_prefix = "/api")


if __name__ == "__main__":
	# app.run(host = "0.0.0.0", port = 3000)
	app.run(debug = True, port = 3000)