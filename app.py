from sys import prefix
from flask import *
from routes.user import user_api
from routes.attraction import attraction_api
from routes.booking import booking_api
from routes.order import order_api

app = Flask(
	__name__,
	static_url_path= "/",
	static_folder = "static"
)
app.config.from_object("config")
app.config["DEBUG"]
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['JSON_SORT_KEYS'] = False

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
@app.route("/member")
def member():
	return render_template("member.html")

# APIs
# User APIs
app.register_blueprint(user_api, url_prefix = "/api")
# Attraction APIs
app.register_blueprint(attraction_api, url_prefix = "/api")
# Booking APIs
app.register_blueprint(booking_api, url_prefix = "/api")
# Order APIs
app.register_blueprint(order_api, url_prefix = "/api")


if __name__ == "__main__":
	app.run(host = app.config["HOST"], port = 3000)