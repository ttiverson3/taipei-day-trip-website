const urlParams = new URLSearchParams(window.location.search);
const number = urlParams.get("number");

let models = {
    data: null,
    getOrderData: function(){
        let url = `api/order/${number}`
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
    renderSuccessData: function(){
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
        document.getElementsByClassName("finish-text")[0].style.display = "block";
        const loader = document.getElementsByClassName("loader-inner")[0]
        loader.style.display = "none";
        const thankyouBody = document.getElementById("thankyou-body");
        thankyouBody.style.display = "block";
    },
    renderFailData: function(){
        const successBlock = document.getElementById("success-top");
        successBlock.style.display = "none";
        const failMsg = document.getElementById("fail-msg");
        if(localStorage.getItem("failMsg")){
            failMsg.textContent = localStorage.getItem("failMsg");
        }
        else{
            failMsg.textContent = "尚未付款";
        }
        const FailBlock = document.getElementById("fail-top");
        FailBlock.style.display = "block";
        document.getElementsByClassName("finish-text")[1].style.display = "block";
        const loader = document.getElementsByClassName("loader-inner")[0];
        loader.style.display = "none";
        const thankyouBody = document.getElementById("thankyou-body");
        thankyouBody.style.display = "block";
    }
}

let controllers = {
    getOrder: function(){
        models.getOrderData().then(() => {
            if(models.data.error){
                window.location.replace("/");
                return
            }
            // 付款成功
            if(models.data.data.status === 1){
                views.renderSuccessData();
                return
            }
            // 付款失敗
            if(models.data.data.status === 0){
                views.renderFailData();
                return
            }
        });
    }
}

window.addEventListener("load", () => controllers.getOrder());