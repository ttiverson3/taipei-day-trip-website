const ul = document.getElementById("attractions");
const finish = document.getElementById("finish");
const btn = document.getElementById("btn");
const keyword = document.getElementsByName("keyword")[0];
let nextPage;
let flag = false;

let getAttractionData = function(page, keyword = "") {
    fetch(`/api/attractions?page=${page}&keyword=${keyword}`, {
        method: "GET",
    })
    .then(res => res.json())
    .then(data => {
        if(data.error) {
            finish.textContent = data.message;
        }
        else {
            nextPage = data.nextPage;
            console.log(nextPage);
            let attr = data.data;
            flag = true;
            for(i = 0; i < attr.length; i++) {
                let li = document.createElement("li");
                let img = document.createElement("img");
                let h2 = document.createElement("h2");
                let div = document.createElement("div");
                let p1 = document.createElement("p");
                let p2 = document.createElement("p");
                let a = document.createElement("a");

                img.src = attr[i].images[0];
                h2.textContent = attr[i].name;
                p1.textContent = attr[i].mrt;
                p2.textContent = attr[i].category;
                a.href = "attraction/" + attr[i].id;

                div.appendChild(p1);
                div.appendChild(p2);
                ul.appendChild(a);
                a.appendChild(li);
                li.appendChild(img);
                li.appendChild(h2);
                li.appendChild(div);
            }
            
        }
        
    })
    .catch(error => console.log(error))
}
getAttractionData(0);

window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    // const lastChild = ul.lastChild;
    // const rect = lastChild.getBoundingClientRect();
    // console.log(scrolled, scrollable);
    if ((scrollable - scrolled) < 1000 && flag === true) {
            if(nextPage === null){
                    if(finish.textContent === ""){
                        finish.textContent = "無更多景點！！！";
                    }
            }
            else{
                // console.log(nextPage);
                getAttractionData(nextPage, keyword.value);
                flag = false;
            }
    }
});

btn.addEventListener("click", () => {
    finish.textContent = "";
    if(keyword.value != ""){
        while(ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        getAttractionData(0, keyword.value);
    }
});

keyword.addEventListener("keydown", (e) => {
    if(e.keyCode === 13) {
        e.preventDefault();
        finish.textContent = "";
        if(keyword.value != ""){
            while(ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
            getAttractionData(0, keyword.value);
        }
    }
});