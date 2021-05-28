const orderNumber = localStorage.getItem("number")

let models = {
    data: null,
    getOrderData: function(){
        let url = `api/order/${orderNumber}`
        options = {
            method: "GET"
        }
        return fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(result => {
            this.data = result;
        })
    }
}

let views = {
    renderData: function(){
        document.getElementById("username").textContent = models.data.data.contact.name;
        document.getElementById("attraction-img").src = models.data.data.trip.attraction.image;
        document.getElementById("order-number").textContent = models.data.data.number;
        document.getElementById("order-attraction").textContent = models.data.data.trip.attraction.name;
        document.getElementById("order-address").textContent = models.data.data.trip.attraction.address;
        document.getElementById("order-date").textContent = models.data.data.trip.date;
        if(models.data.data.trip.time === "morning"){
            document.getElementById("order-time").textContent = "早上 9 點到下午 4 點";
        }
        else{
            document.getElementById("order-time").textContent = "下午 2 點到晚上 9 點";
        }
        document.getElementById("order-price").textContent = "新台幣 " + models.data.data.price + " 元";

        const loader = document.getElementsByClassName("loader-inner")[0]
        loader.style.display = "none";
        let thankyouBody = document.getElementById("thankyou-body");
        thankyouBody.style.display = "block";
    }
}

let controllers = {
    getOrder: function(){
        models.getOrderData().then(() => {
            // console.log(models.data)
            if(models.data.error){
                window.location.replace("/");
                return
            }
            views.renderData();
        });
    }
}

window.addEventListener("load", () => controllers.getOrder());