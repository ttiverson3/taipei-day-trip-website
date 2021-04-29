const ul = document.getElementById("attractions") 

let nextPage;
let get_attractions = function(page, keyword = "") {
    fetch(`/api/attractions?page=${page}&keyword=${keyword}`, {
        method: "GET",
    })
        .then(res => res.json())
        .then(data => {
            nextPage = data.nextPage
            let attr = data.data
            for(i = 0; i < attr.length; i++) {
                let li = document.createElement("li");
                let img = document.createElement("img");
                let h2 = document.createElement("h2");
                let div = document.createElement("div");
                let p1 = document.createElement("p");
                let p2 = document.createElement("p");

                img.src = attr[i].images[0];
                h2.textContent = attr[i].name;
                p1.textContent = attr[i].mrt;
                p2.textContent = attr[i].category;

                div.appendChild(p1);
                div.appendChild(p2);
                ul.appendChild(li);
                li.appendChild(img);
                li.appendChild(h2);
                li.appendChild(div);
            }
        })
        .catch(error => console.log("error"))
}

get_attractions(0);

let finish;
window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if (scrollable === scrolled) {
            if(nextPage === null){
                    if(finish === undefined){
                        const main = document.getElementsByTagName("main")[0]
                        finish = document.createElement("h2");
                        finish.classList.add("finish");
                        finish.textContent = "無更多景點！！！";
                        main.appendChild(finish);
                    }
            }
            else{
                get_attractions(nextPage);
            }
    }
});

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
    const keyword = document.getElementsByName("keyword")[0];
    if(keyword.value != ""){
        while(ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    // console.log(keyword.value);

});
