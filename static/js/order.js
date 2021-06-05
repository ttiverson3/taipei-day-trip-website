let models = {
    data: null,
    status: 0,
    getOrderData: function(){
        let url = "api/orders"
        options = {
            method: "GET"
        }
        return fetch(url, options)
        .then(response => {
            this.status = response.status;
            return response.json();
        })
        .then(result => {
            this.data = result
        }).catch(error => console.log(error));
    }
}


let views = {
    page: 0,
    renderData: function(){
        // 顯示載入動畫
        const loader = document.getElementsByClassName("loader-inner")[0];
        loader.style.display = "block";
        // 隱藏訂單頁面
        const orderBody = document.getElementById("order-body");
        orderBody.style.display = "none";
        // 渲染訂單表格
        const fragment = document.createDocumentFragment();
        const orderData = models.data.data;
        let num = 0;
        if(models.data.data.length < 10){
            num = models.data.data.length;
        }
        else{
            num = 10;
        }
        for(i = views.page * 10; i < views.page * 10 + num; i++){
            let data = orderData[i];
            const tr = document.createElement("tr");
            const td = document.createElement("td")
            td.textContent = i + 1;
            tr.appendChild(td);
            for(key in data){
                const td = document.createElement("td");
                if(key === "status"){
                    if(data[key] === 1){
                        td.textContent = "已付款";
                    }
                    else{
                        td.textContent = "未付款";
                    }
                }
                else{
                    td.textContent = data[key];
                }
                tr.appendChild(td);
            }
            const lastTd = document.createElement("td");
            const btn = document.createElement("button");
            btn.textContent = "檢視";
            lastTd.appendChild(btn);
            tr.appendChild(lastTd);
            fragment.appendChild(tr);
        }
        // 訂單資料加入表格中
        const orderTable = document.getElementById("order-table");
        orderTable.appendChild(fragment);
        // 加入頁碼
        const currentPage = document.getElementById("current-page");
        currentPage.textContent = this.page + 1;
        const totalPage = document.getElementById("total-page");
        const totalPages = Math.ceil(models.data.data.length / 10)
        totalPage.textContent = totalPages
        // pagination 製作
        const pagination = document.getElementById("pagination");
        const prev = document.createElement("a")
        prev.innerHTML = "&laquo;";
        prev.classList.add("prev");
        prev.addEventListener("click", controllers.plusPage.bind(null, -1));
        pagination.appendChild(prev);
        for(i = 0; i < totalPages; i++){
            const a = document.createElement("a");
            a.classList.add("page");
            a.textContent = i + 1;
            if(i == 0){
                a.classList.add("active")
            }
            a.addEventListener("click", controllers.currentPage.bind(null, i));
            pagination.appendChild(a);
        }
        const plus = document.createElement("a")
        plus.innerHTML = "&raquo;";
        plus.classList.add("plus");
        plus.addEventListener("click", controllers.plusPage.bind(null, 1));
        pagination.appendChild(plus);
        // 顯示訂單頁面
        orderBody.style.display = "block";
        // 隱藏載入效果
        loader.style.display = "none";
    },
    showOrders: function(n){
        const pagination = document.getElementById("pagination");
        // 總頁數
        let total_page = Array.from(pagination.getElementsByTagName("a")).length - 2;
        if(n > total_page - 1) views.page = total_page - 1; // 超過最大頁數，固定在最後一頁
        if(n < 0) views.page = 0; // 超過最小頁數，固定在第一頁
        // 清除 table
        const orderTable = document.getElementById("order-table");
        orderTable.innerHTML = "";
        // 清除所有 pages 的 active 效果
        let pages = Array.from(document.getElementsByClassName("page"));
        pages.forEach(data => {
            data.className = data.className.replace(" active", "");
        });
        // 顯示該 index page 的 active 效果
        pages[views.page].className += " active";
        // 當前頁面
        const currentPage = document.getElementById("current-page");
        currentPage.textContent = views.page + 1;
        // 渲染訂單表格
        const fragment = document.createDocumentFragment();
        const orderData = models.data.data;
        let num = 0;
        if(models.data.data.length < 10){
            num = models.data.data.length;
        }
        else{
            num = 10;
        }
        for(i = views.page * 10; i < views.page * 10 + num; i++){
            let data = orderData[i];
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.textContent = i + 1;
            tr.appendChild(td);
            for(key in data){
                const td = document.createElement("td");
                if(key === "status"){
                    if(data[key] === 1){
                        td.textContent = "已付款";
                    }
                    else{
                        td.textContent = "未付款";
                    }
                }
                else{
                    td.textContent = data[key];
                }
                tr.appendChild(td);
            }
            const lastTd = document.createElement("td");
            const btn = document.createElement("button");
            btn.textContent = "檢視";
            lastTd.appendChild(btn);
            tr.appendChild(lastTd);
            fragment.appendChild(tr);
            orderTable.appendChild(fragment);
        }
    },
    renderNoOrders: function(){
        const loader = document.getElementsByClassName("loader-inner")[0];
        loader.style.display = "block";
        const orderBody = document.getElementById("order-body");
        orderBody.innerHTML = ""
        const noDataBlock = document.createElement("div");
        noDataBlock.classList.add("top");
        const noDataMsg = document.createElement("h2");
        noDataMsg.textContent = models.data.message;
        noDataBlock.appendChild(noDataMsg);
        orderBody.appendChild(noDataBlock);
        orderBody.style.display = "block";
        loader.style.display = "none";
    },
    renderOrderData: function(number){
        let data = models.data.data;
        for(i = 0; i < data.length; i++){
            if(number === data[i].oid){
                // 清除 table
                const orderTable = document.getElementById("order-table");
                orderTable.innerHTML = "";
                // 隱藏底部
                const bottom = document.getElementsByClassName("bottom")[0];
                bottom.style.display = "none";
                // 新增一列
                const fragment = document.createDocumentFragment();
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.textContent = 1;
                tr.appendChild(td);
                for(key in data[i]){
                    const td = document.createElement("td");
                    if(key === "status"){
                        if(data[key] === 1){
                            td.textContent = "已付款";
                        }
                        else{
                            td.textContent = "未付款";
                        }
                    }
                    else{
                        td.textContent = data[i][key];
                    }
                    tr.appendChild(td);
                }
                const lastTd = document.createElement("td");
                const btn = document.createElement("button");
                btn.textContent = "檢視";
                lastTd.appendChild(btn);
                tr.appendChild(lastTd);
                fragment.appendChild(tr);
                orderTable.appendChild(fragment);
            }
        }
    }
}

let controllers = {
    init: function(){
        models.getOrderData().then(() => {
            // 未登入
            if(models.status === 403){
                window.location.replace("/");
                return
            }
            // 無訂單資料
            else if(models.status === 400){
                views.renderNoOrders();
            }
            // 已登入
            else{
                views.renderData();
            }
        })
    },
    plusPage: function(n){
        views.showOrders(views.page += n);
    },
    currentPage: function(n){
        views.showOrders(views.page = n);
    },
    keydown: function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            const number = document.getElementById("number-input").value;
            views.renderOrderData(number);
        }
    }
}

window.addEventListener("load", () => controllers.init());
document.getElementById("number-input").addEventListener("keydown", (e) => controllers.keydown(e));