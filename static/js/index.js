let flag = false; // 紀錄 API 要求是否已完成
let nextPage; // 紀錄已載入頁數

let models = {
    data: null,
    getAttractionData: function(page, keyword = ""){
        let url = `/api/attractions?page=${page}&keyword=${keyword}`;
        return fetch(url).then((response) => {
            return response.json();
        }).then((result) => {
            this.data = result;
            flag = true; // 要求已完成
        }).catch(error => console.log(error));
    }
};

let views = {
    renderData: function(){
        if(!models.data.error){
            nextPage = models.data.nextPage;
            console.log(nextPage);
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
        if(condition === "close") document.getElementById("myModal").style.display = "none";
    },
    showModalContent: function(condition){
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
    init: function(){
        models.getAttractionData(0).then(() => {
            views.renderData();
        });
    },
    scroll: function(){
        let scrollable = document.documentElement.scrollHeight - window.innerHeight; // 可捲動高度
        let scrolled = window.scrollY; // 已捲動高度
        if(scrolled > scrollable * 0.7 && flag === true){
            if(nextPage != null){
                flag = false;
                let keyword = document.getElementsByName("keyword")[0].value;
                models.getAttractionData(nextPage, keyword).then(() => {
                    views.renderData();
                });
            }
            else{
                views.renderFinishMsg();
            }
        }
    },
    click: function(){
        let keyword = document.getElementsByName("keyword")[0].value;
        if(keyword != ""){
            const list = document.getElementById("attractions");
            list.innerHTML = "" // 清空景點列表
            views.removeFinishMsg(); // 清空結束訊息
            models.getAttractionData(0, keyword).then(() => {
                views.renderData();
            });
        }
    },
    keydown: function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            let keyword = document.getElementsByName("keyword")[0].value;
            if(keyword != ""){
                const list = document.getElementById("attractions");
                list.innerHTML = "" // 清空景點列表
                views.removeFinishMsg(); // 清空結束訊息
                models.getAttractionData(0, keyword).then(() => {
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
document.getElementById("loginBtn").addEventListener("click", () => views.showModal("open"));
document.getElementsByClassName("close")[0].addEventListener("click", () => views.showModal("close"));
document.getElementById("doRegisterBtn").addEventListener("click", () => views.showModalContent("rigister"));
document.getElementById("doLoginBtn").addEventListener("click", () => views.showModalContent("login"));