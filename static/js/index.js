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
            const list = document.getElementById("attractions");
            nextPage = models.data.nextPage;
            console.log(nextPage);
            let attractionData = models.data.data;
            attractionData.forEach(data => {
                let link = document.createElement("a");
                let card = document.createElement("li");
                let image = document.createElement("img");
                let name = document.createElement("h2");
                let info = document.createElement("div");
                let mrt = document.createElement("p");
                let category = document.createElement("p");
                link.href = "attraction/" + data.id;
                image.src = data.images[0];
                name.textContent = data.name;
                mrt.textContent = data.mrt;
                category.textContent = data.category;
                list.appendChild(link);
                link.appendChild(card);
                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(info);
                info.appendChild(mrt);
                info.appendChild(category);
            });
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