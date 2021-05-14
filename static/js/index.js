let models = {
    data: null,
    nextPage: 0,
    keyword: "",
    getAttractionData: function(page, keyword = ""){
        let url = "";
        if(keyword == "") url = `/api/attractions?page=${page}`;
        else url = `/api/attractions?page=${page}&keyword=${keyword}`;
        return fetch(url).then((response) => {
            return response.json();
        }).then((result) => {
            this.data = result;
            this.nextPage = result.nextPage;
        }).catch(error => console.log(error));
    }
};

let views = {
    renderData: function(){
        if(!models.data.error){
            controllers.flag = true;
            let attractionData = models.data.data;
            let fragment = document.createDocumentFragment();
            attractionData.forEach(data => {
                let link = document.createElement("a");
                link.href = "attraction/" + data.id;
                let card = document.createElement("li");
                let image = document.createElement("img");
                image.src = data.images[0];
                let name = document.createElement("h2");
                name.textContent = data.name;
                let info = document.createElement("div");
                let mrt = document.createElement("p");
                mrt.textContent = data.mrt;
                let category = document.createElement("p");
                category.textContent = data.category;
                fragment.appendChild(link);
                link.appendChild(card);
                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(info);
                info.appendChild(mrt);
                info.appendChild(category);
            });
            const list = document.getElementById("attractions");
            list.appendChild(fragment);
        }
        else{
            views.renderFinishMsg();
        }
    },
    renderFinishMsg: function(){
        let msg = document.getElementById("finish");
        msg.textContent = "無更多景點！！！";
        
    },
    removeFinishMsg: function(){
        let msg = document.getElementById("finish");
        msg.textContent = "";
    },
    showModal: function(condition){
        if(condition === "open") document.getElementById("myModal").style.display = "block";
        if(condition === "close") {
            document.getElementById("myModal").style.display = "none";
            views.renderModalContent("login");
        } 
    },
    renderModalContent: function(condition){
        let loginContent = Array.from(document.getElementsByClassName("login-content"));
        let registerContent = Array.from(document.getElementsByClassName("register-content"));
        if(condition === "rigister"){
            loginContent.forEach(element => {
                element.style.display = "none";
            });
            registerContent.forEach(element => {
                element.style.display = "block";
            });
        }
        if(condition === "login"){
            loginContent.forEach(element => {
                element.style.display = "block";
            });
            registerContent.forEach(element => {
                element.style.display = "none";
            });
        }
    }
};

let controllers = {
    flag: false,
    init: function(){
        models.getAttractionData(0).then(() => {
            views.renderData();
        });
    },
    scroll: function(){
        let scrollable = document.documentElement.scrollHeight - window.innerHeight; // 可捲動高度
        let scrolled = window.scrollY; // 已捲動高度
        if(scrolled > scrollable * 0.7 && controllers.flag){
            if(models.nextPage != null){
                controllers.flag = false;
                models.getAttractionData(models.nextPage, models.keyword).then(() => {
                    views.renderData();
                });
            }
            else{
                controllers.flag = false;
                views.renderFinishMsg();
            }
        }
    },
    click: function(){
        models.keyword = document.getElementsByName("keyword")[0].value;
        if(models.keyword != ""){
            const list = document.getElementById("attractions");
            list.innerHTML = "" // 清空景點列表
            views.removeFinishMsg(); // 清空結束訊息
            models.getAttractionData(0, models.keyword).then(() => {
                views.renderData();
            });
        }
    },
    keydown: function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            models.keyword = document.getElementsByName("keyword")[0].value;
            if(models.keyword != ""){
                const list = document.getElementById("attractions");
                list.innerHTML = "" // 清空景點列表
                views.removeFinishMsg(); // 清空結束訊息
                models.getAttractionData(0, models.keyword).then(() => {
                    views.renderData();
                });
            }
        }
    }
};

window.onload = () => controllers.init();
window.addEventListener("scroll", () => controllers.scroll());
document.getElementById("btn").addEventListener("click", () => controllers.click());
document.getElementsByName("keyword")[0].addEventListener("keydown", (e) => controllers.keydown(e));
