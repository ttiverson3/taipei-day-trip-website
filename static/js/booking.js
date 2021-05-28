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
    },
    sendOrderData: function(prime){
        // console.log(prime)
        let booking_data = models.data.data;
        const price = booking_data.price;
        const attractionId = booking_data.attraction.id;
        const attraction_name = booking_data.attraction.name;
        const address = booking_data.attraction.address;
        const image = booking_data.attraction.image;
        const date = booking_data.date;
        const time = booking_data.time;
        const phone = document.getElementById("booking-phone").value;
        data = {
            prime: prime,
            order: {
                price: price,
                trip: {
                    attraction: {
                        id: attractionId,
                        name: attraction_name,
                        address: address,
                        image: image,
                    },
                    date: date,
                    time: time,
                },
                contact: {
                    name: localStorage.getItem("username"),
                    email: localStorage.getItem("email"),
                    phone: phone
                }
            }
        }
        // console.log(data)
        let url = "api/orders"
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        return fetch(url, options)
        .then(response => {
            return response.json()
        })
        .then(result => {
            return result;
        }).catch(error => console.log(error));
    },
    checkInfo: function(){
        const bookingForm = document.forms[1];
        if(!bookingForm.checkValidity()){
            bookingForm.reportValidity();
            return false;
        }
        return true;
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
            document.getElementById("attraction-time").textContent = "下午 2 點到晚上 9 點";
        }
        document.getElementById("attraction-price").textContent = "新台幣 " + price + " 元";
        document.getElementById("attraction-address").textContent = address;
        // middle
        document.getElementById("booking-name").value = localStorage.getItem("username");
        document.getElementById("booking-email").value = localStorage.getItem("email");
        // bottom
        document.getElementById("total-price").textContent = "新台幣 " + price + " 元";
        
        const loader = document.getElementsByClassName("loader-inner")[0]
        loader.style.display = "none";
        let bookingBody = document.getElementById("booking-body");
        bookingBody.style.display = "block";
    },
    renderNoBookingData: function(){
        let bookingBody = document.getElementById("booking-body");
        let welcome_text = bookingBody.querySelector("#welcome-text");
        let text = welcome_text.textContent.split("，")
        text[1] = localStorage.getItem("username");
        welcome_text.textContent = text.join("，");
        welcome_text.style.color = "#666";
        let msg = document.getElementById("no-booking-message");
        msg.style.display = "block";
        bookingBody.innerHTML = "";
        bookingBody.appendChild(welcome_text);
        bookingBody.appendChild(msg);
        let main = document.getElementsByTagName("main")[0];
        main.innerHTML = "";
        main.appendChild(bookingBody);
        bookingBody.style.display = "block";
    }
}


let controllers = {
    load: function(){
        models.getBookingData().then(() => {
                // 無預定資料
                if(models.data.data === null){
                    views.renderNoBookingData();
                    return
                }
                // 有預定資料
                if(models.data.data){
                    views.renderBookingData();
                    return
                }
                // 未登入
                if(models.data.error){
                    window.location.replace("/");
                    return
                }
        });
    },
    removeBooking: function(){
        models.removeBookingData().then(() => {
            if(models.data.ok){
                views.renderNoBookingData();
                return
            }
        });
    },
    sendOrder: function(e){
        e.preventDefault();
        if(models.checkInfo()){
            const tappayStatus = TPDirect.card.getTappayFieldsStatus();
            if (tappayStatus.canGetPrime === false) {
                alert('can not get prime')
                return
            }
            // Get prime
            TPDirect.card.getPrime((result) => {
                if (result.status !== 0) {
                    console.log('get prime error ' + result.msg)
                    return
                }
                // alert('get prime 成功，prime: ' + result.card.prime)
                let prime = result.card.prime;
                models.sendOrderData(prime).then((result) => {
                    // 付款失敗
                    if(result.error){
                        alert(result.message);
                    }
                    // 付款成功
                    else{
                        // 刪除預定資料
                        models.removeBookingData().then(() => {
                            if(models.data.ok){
                                localStorage.setItem("number", result.data.number);
                                window.location.replace("/thankyou");
                                return
                            }
                        })
                    }
                })
            })
        }
        
    }
}

window.onload = () => {
    modalControllers.checkUserCondition();
    controllers.load();
} 
document.getElementById("delBtn").addEventListener("click", () => controllers.removeBooking());
const submitButton = document.getElementById("orderBtn")
submitButton.addEventListener("click", (e) => controllers.sendOrder(e));