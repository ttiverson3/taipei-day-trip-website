let id = window.location.pathname.split("/")[2];
const left = document.getElementById("left");
const title = document.getElementById("title");
const category = document.getElementById("category");
const desc = document.getElementById("desc");
const address = document.getElementById("address");
const transport = document.getElementById("transport");
const radio1 = document.getElementsByName("day")[0]
const radio2 = document.getElementsByName("day")[1]
const price = document.getElementById("price");
const dots = document.getElementsByClassName("dots")[0];
let slideIndex = 1;

let getAttractionInfo = function(id) {
    fetch(`/api/attraction/${id}`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        if(data.error) {
            document.body.innerHTML = "Not Found";
        }
        else {
            for(i = 0; i < data.data.images.length; i++) {
                let div = document.createElement("div");
                div.classList.add("mySlides");
                // div.classList.add("fade");
                let img = document.createElement("img");
                img.src = data.data.images[i];
                left.appendChild(div);
                div.appendChild(img);

                let dot = document.createElement("span");
                dot.addEventListener("click", currentSlide.bind(null, i + 1));
                dot.classList.add("dot");
                dots.appendChild(dot);
            }
            title.textContent = data.data.name;
            category.textContent = data.data.category + " at " + data.data.mrt; 
            desc.textContent = data.data.description;
            address.textContent = data.data.address;
            transport.textContent = data.data.transport;

            showSlides(slideIndex);
        }
    })
};
getAttractionInfo(id);

radio1.addEventListener("click", () => {
    price.textContent = "新台幣 2000 元";
});
radio2.addEventListener("click", () => {
    price.textContent = "新台幣 2500 元";
});


let showSlides = function(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dot = document.getElementsByClassName("dot");
    if(n > slides.length){
        slideIndex = 1;
    }
    if(n < 1){
        slideIndex = slides.length;
    }
    for(i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for(i = 0; i < dot.length; i++) {
        dot[i].className = dot[i].className.replace(" active", "");
    }
    
    slides[slideIndex - 1].style.display = "block";
    dot[slideIndex - 1].className += " active";
};

let plusSlides = function(n) {
    showSlides(slideIndex += n);
};


let currentSlide = function(n) {
    showSlides(slideIndex = n);
};
