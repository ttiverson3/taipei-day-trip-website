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
    // 渲染景點資訊
    renderData: function(){
        if(!models.data.error){
            controllers.flag = true; // API 請求完成
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
            // 關閉載入效果
            const loader = document.getElementsByClassName("loader-inner")[0]
            loader.style.display = "none";
            // 顯示歡迎區塊、景點資訊
            const section = document.getElementsByTagName("section")[0]
            section.style.display = "block";
            list.style.display = "flex";
        }
        else{
            views.renderFinishMsg();
        }
    },
    // 渲染結束訊息
    renderFinishMsg: function(){
        let msg = document.getElementById("finish");
        msg.textContent = "無更多景點！！！";
        
    },
    // 移除結束訊息
    removeFinishMsg: function(){
        let msg = document.getElementById("finish");
        msg.textContent = "";
    }
};

let controllers = {
    // API 請求是否完成
    flag: false,
    // 初始化頁面：載入 20 個景點資訊
    init: function(){
        models.getAttractionData(0).then(() => {
            views.renderData();
        });
    },
    // 滑鼠滾動事件
    scroll: function(){
        let scrollable = document.documentElement.scrollHeight - window.innerHeight; // 可捲動高度
        let scrolled = window.scrollY; // 已捲動高度
        // 已捲動高度超過 7 成，且上個 API 請求已完成，執行景點資訊載入
        if(scrolled > scrollable * 0.7 && controllers.flag){
            // 還有景點資料
            if(models.nextPage != null){
                controllers.flag = false; // API 請求關閉
                // 載入景點資訊
                models.getAttractionData(models.nextPage, models.keyword).then(() => {
                    views.renderData();
                });
            }
            // 已無景點資料
            else{
                controllers.flag = false; // API 請求關閉
                views.renderFinishMsg(); // 渲染結束訊息
            }
        }
    },
    // input btn 點擊事件
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

// 初始化頁面
window.onload = () => controllers.init();
// 滑鼠滾動景點無限載入
window.addEventListener("scroll", () => controllers.scroll());
// 景點搜尋 btn 滑鼠點擊
document.getElementById("btn").addEventListener("click", () => controllers.click());
// 景點搜尋 input 的 enter 點擊
document.getElementsByName("keyword")[0].addEventListener("keydown", (e) => controllers.keydown(e));
