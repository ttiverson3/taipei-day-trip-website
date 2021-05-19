let models = {
    data: null,
    getBookingData: function(){
        let url = "/api/booking";
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
        return fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(result => {
            this.data = result;
        }).catch(error => console.log(error));
    },
    removeBookingData: function(){
        let url = "/api/booking";
        let options = {
            method: "DELETE",
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
    renderBookingData: function(){
        let booking_data = models.data.data;
        let image = booking_data.attraction.image;
        let attraction = booking_data.attraction.name;
        let date = booking_data.date;
        let time = booking_data.time;
        let price = booking_data.price;
        let address = booking_data.attraction.address;
        // top
        document.getElementById("username").textContent = localStorage.getItem("username");
        document.getElementById("attraction-img").src = image;
        document.getElementById("attraction-title").textContent = "台北一日遊：" + attraction;
        document.getElementById("attraction-date").textContent = date;
        if(time === "morning") {
            document.getElementById("attraction-time").textContent = "早上 9 點到下午 4 點";
        }
        else {
            document.getElementById("attraction-time").textContent = "下午 5 點到晚上 10 點";
        }
        document.getElementById("attraction-price").textContent = "新台幣 " + price + " 元";
        document.getElementById("attraction-address").textContent = address;
        // middle
        document.getElementById("booking-name").value = localStorage.getItem("username");
        document.getElementById("booking-email").value = localStorage.getItem("email");
        // bottom
        document.getElementById("total-price").textContent = "新台幣 " + price + " 元";
    },
    renderNoBookingData: function(){
        let top = document.getElementById("top");
        let welcome_text = top.querySelector("#welcome-text");
        let text = welcome_text.textContent.split("，")
        text[1] = localStorage.getItem("username");
        welcome_text.textContent = text.join("，");
        let msg = document.getElementById("no-booking-message");
        msg.style.display = "block";
        top.innerHTML = "";
        top.appendChild(welcome_text);
        top.appendChild(msg);
        let main = document.getElementsByTagName("main")[0];
        main.innerHTML = "";
        main.appendChild(top);
    }
}


let controllers = {
    load: function(){
        models.getBookingData().then(() => {
            if(modalControllers.loginStatus){
                // 無預定資料
                if(models.data.data === null){
                    views.renderNoBookingData();
                }
                // 有預定資料
                if(models.data.data){
                    views.renderBookingData();
                }
                // 未登入
                if(models.data.error){
                    window.location.replace("/");
                }
            }
            else{
                window.location.replace("/");
            }
        });
    },
    removeBooking: function(){
        models.removeBookingData().then(() => {
            if(models.data.ok){
                views.renderNoBookingData();
            }
        });
    }
}

window.onload = () => {
    modalControllers.checkUserCondition();
    controllers.load();
} 
document.getElementById("delBtn").addEventListener("click", () => controllers.removeBooking());