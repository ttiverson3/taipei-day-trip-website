let models = {
    data: null,
    status: 0,
    getAttractionInfo: function(id){
        let url = `/api/attraction/${id}`;
        return fetch(url).then(response => {
            return response.json();
        }).then((result) => {
            this.data = result;
        }).catch((error) => console.log(error));
    },
    sendBookingData: function(){
        let attraction_id = window.location.pathname.split("/")[2];
        let date = document.getElementById("date").value;
        let days = Array.from(document.getElementsByName("day"));
        let time = "";
        days.forEach(function(item){
            if(item.checked) {
                time = item.value;
            }
        })
        let price = parseInt(document.getElementById("price").textContent.split(" ")[1]);
        data = {
            attractionId: attraction_id,
            date: date,
            time: time,
            price: price
        }
        options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        let url = "/api/booking"
        return fetch(url, options)
        .then(response => {
            this.status = response.status
            return response.json();
        })
        .then(result => {
            this.data = result;
        }).catch((error) => console.log(error));
    }
}

let views = {
    renderData: function(){
        if(!models.data.error){
            let attraction = models.data.data;
            let attractionImgs = attraction.images;
            let fragmentSlides = document.createDocumentFragment();
            let fragmentDots = document.createDocumentFragment();
            attractionImgs.forEach((data, index) => {
                let img = document.createElement("img");
                img.src = data;
                let slides = document.createElement("div");
                slides.classList.add("mySlides");
                slides.appendChild(img);
                fragmentSlides.appendChild(slides);
                let dot = document.createElement("span");
                dot.addEventListener("click", controllers.currentSlide.bind(null, index));
                dot.classList.add("dot");
                fragmentDots.appendChild(dot);
            });
            const left = document.getElementById("left");
            left.appendChild(fragmentSlides);
            const dots = document.getElementsByClassName("dots")[0];
            dots.appendChild(fragmentDots);
            const title = document.getElementById("title");
            title.textContent = attraction.name;
            const category = document.getElementById("category");
            category.textContent = attraction.category + " at " + attraction.mrt;
            const desc = document.getElementById("desc");
            desc.textContent = attraction.description;
            const address = document.getElementById("address");
            address.textContent = attraction.address;
            const transport = document.getElementById("transport");
            transport.textContent = attraction.transport;
            views.showSlides(controllers.slideIndex);
        }
        else{
            document.body.innerHTML = "Not Found";
        }
    },
    showSlides: function(n){
        let slides = Array.from(document.getElementsByClassName("mySlides"));
        let dots = Array.from(document.getElementsByClassName("dot"));
        if(n > slides.length - 1) controllers.slideIndex = 0; // 超過最大 index 跳至第一張
        if(n < 0) controllers.slideIndex = slides.length - 1; // 超過最小 index 跳至最後一張
        // 隱藏所有照片
        slides.forEach(data => {
            data.style.height = 0;
            data.style.visibility = "hidden";
            data.style.opacity = 0;
        });
        // 清除所有 dot 的 active 效果
        dots.forEach(data => {
            data.className = data.className.replace(" active", "");
        });
        // 顯示該 index 的照片
        slides[controllers.slideIndex].style.height = "100%";
        slides[controllers.slideIndex].style.visibility = "visible";
        slides[controllers.slideIndex].style.opacity = 1;
        // 顯示該 index dot 的 active 效果  
        dots[controllers.slideIndex].className += " active";
    },
    showPrice: function(time){
        const price = document.getElementById("price");
        if(time === "FirstHalfDay") price.textContent = "新台幣 2000 元";
        if(time === "SecondHalfDay") price.textContent = "新台幣 2500 元";
    }
}

let controllers = {
    slideIndex: 0,
    load: function(){
        let id = window.location.pathname.split("/")[2];
        let dt = new Date()
        let minYear = String(dt.getFullYear());
        let minMonth = String((dt.getMonth() + 1));
        if(minMonth.length === 1) minMonth = "0" + minMonth;
        let minDate = String(dt.getDate());
        if(minDate.length ===1) minDate = "0" + minDate;
        document.getElementById("date").min = minYear + "-" + minMonth + "-" + minDate ;
        models.getAttractionInfo(id).then(() => {
            views.renderData();
        });
    },
    radioClick: function(time){
        views.showPrice(time);
    },
    plusSlides: function(n){
        views.showSlides(controllers.slideIndex += n);
    },
    currentSlide: function(n){
        views.showSlides(controllers.slideIndex = n)
    },
    sendBookingInfo: function(e){
        e.preventDefault();
        if(modalControllers.loginStatus){
            let date = document.getElementById("date");
            if(date.value === ""){
                date.setCustomValidity("請選擇日期 Please choose the date");
                date.reportValidity();
            }
            else{
                models.sendBookingData().then(() => {
                    if(models.data.ok){
                        window.location.href = "/booking";
                    }
                    if(models.status === 400){
                        alert("已有預定行程，請至預定行程頁面查看");
                    }
                    if(models.status === 403){
                        modalViews.showModal();
                    }
                    if(models.status === 500){
                        console.log("server error");
                    }
                });
            }
            
        }
        else{
            modalViews.showModal();
        }
    }
}

window.onload = () => controllers.load();
document.getElementsByName("day")[0].addEventListener("click", () => controllers.radioClick("FirstHalfDay"));
document.getElementsByName("day")[1].addEventListener("click", () => controllers.radioClick("SecondHalfDay"));
document.getElementsByClassName("prev")[0].addEventListener("click", () => controllers.plusSlides(-1));
document.getElementsByClassName("next")[0].addEventListener("click", () => controllers.plusSlides(1));
document.getElementById("startBooking").addEventListener("click", (e) => controllers.sendBookingInfo(e));