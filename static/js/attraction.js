let slideIndex = 0;

let models = {
    data: null,
    getAttractionInfo: function(id){
        let url = `/api/attraction/${id}`;
        return fetch(url).then(response => {
            return response.json();
        }).then((result) => {
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
            views.showSlides(slideIndex);
        }
        else{
            document.body.innerHTML = "Not Found";
        }
    },
    showSlides: function(n){
        let slides = Array.from(document.getElementsByClassName("mySlides"));
        let dots = Array.from(document.getElementsByClassName("dot"));
        if(n > slides.length - 1) slideIndex = 0; // 超過最大 index 跳至第一張
        if(n < 0) slideIndex = slides.length - 1; // 超過最小 index 跳至最後一張
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
        slides[slideIndex].style.height = "100%";
        slides[slideIndex].style.visibility = "visible";
        slides[slideIndex].style.opacity = 1;
        // 顯示該 index dot 的 active 效果  
        dots[slideIndex].className += " active";
    },
    showPrice: function(time){
        const price = document.getElementById("price");
        if(time === "FirstHalfDay") price.textContent = "新台幣 2000 元";
        if(time === "SecondHalfDay") price.textContent = "新台幣 2500 元";
    }
}

let controllers = {
    load: function(){
        let id = window.location.pathname.split("/")[2];
        models.getAttractionInfo(id).then(() => {
            views.renderData();
        });
    },
    radioClick: function(time){
        views.showPrice(time);
    },
    plusSlides: function(n){
        views.showSlides(slideIndex += n);
    },
    currentSlide: function(n){
        views.showSlides(slideIndex = n)
    }
}

window.onload = () => controllers.load();
document.getElementsByName("day")[0].addEventListener("click", () => controllers.radioClick("FirstHalfDay"));
document.getElementsByName("day")[1].addEventListener("click", () => controllers.radioClick("SecondHalfDay"));
document.getElementsByClassName("prev")[0].addEventListener("click", () => controllers.plusSlides(-1));
document.getElementsByClassName("next")[0].addEventListener("click", () => controllers.plusSlides(1));