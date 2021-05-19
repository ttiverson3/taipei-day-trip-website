let modalModels = {
    url: "/api/user",
    data: null,
    // 登入
    userLogin: function(email, password){
        data = {
            email: email,
            password: password
        };
        let url = modalModels.url;
        let options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        return fetch(url, options)
        .then(response => {
            return response.json()
        })
        .then(result => {
            this.data = result;
        }).catch((error) => console.log(error));
    },
    // 註冊
    userRegister: function(name, email, password){
        data = {
            name: name,
            email: email,
            password: password
        };
        let url = modalModels.url;
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        return fetch(url, options)
        .then(response => {
            return response.json()
        })
        .then(result => {
            this.data = result;
        })
    },
    // 取得使用者資訊
    userInfo: function(){
        let url = modalModels.url;
        let options = {
            method: "GET"
        }
        return fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(result => {
            this.data = result;
        }).catch(error => console.log(error));
    },
    // 登出
    userLogout: function(){
        let url = modalModels.url;
        let options = {
            method: "DELETE"
        }
        return fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(result => {
            this.data = result;
        }).catch(error => console.log(error));
    },
    // 檢查註冊表單資料格式
    checkInputFormat: function(){
        let name = document.getElementById("name");
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        if(!password.checkValidity()){
            document.getElementById("modalMessage").style.display = "block";
            document.getElementById("modalMessage").textContent = "密碼由至少 8 個英文、數字、符號組成"
        }
        if(!email.checkValidity()){
            document.getElementById("modalMessage").style.display = "block";
            document.getElementById("modalMessage").textContent = "請輸入完整電子郵件 (其中必須包含@)"
        }
        if(!name.checkValidity()){
            document.getElementById("modalMessage").style.display = "block";
            document.getElementById("modalMessage").textContent = "使用者名稱由 4 - 12 個任意英數字或中文組成"
        }
        if(name.checkValidity() && email.checkValidity() && password.checkValidity()){
            document.getElementById("modalMessage").style.display = "none";
            return true;
        }
    }
}

let modalViews = {
    showModal: function(){
        let modal = document.getElementById("myModal");
        modal.style.display = "block"
    },
    closeModal: function(){
        // 隱藏 modal
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
        // 渲染回登入介面
        modalViews.renderModalContent("login");
        // 還原介面 (移除各種提示訊息及資料)
        modalViews.removeModalMessage();
        modalViews.removeWarning();
        modalViews.removeModalValues();
    },
    // 移除表單提示訊息
    removeModalMessage: function(){
        let modalMessage = document.getElementById("modalMessage");
        modalMessage.textContent = "";
    },
    // 點選任意地方關閉 modal
    clickOutspaceCloseModal: function(e){
        let modal = document.getElementById("myModal");
        if(e.target === modal){
            modalViews.closeModal();
        }
    },
    // 渲染 modal 介面，有登入或註冊兩種情況
    renderModalContent: function(condition){
        let loginContent = Array.from(document.getElementsByClassName("login-content"));
        let registerContent = Array.from(document.getElementsByClassName("register-content"));
        // 還原介面 (移除各種提示訊息及資料)
        modalViews.removeModalValues();
        modalViews.removeModalMessage();
        modalViews.removeWarning();
        if(condition === "rigister"){ // 註冊情況
            // 隱藏登入表單
            loginContent.forEach(element => {
                element.style.display = "none";
            });
            // 渲染註冊表單
            registerContent.forEach(element => {
                if(element.id == "name"){
                    element.style.display = "inline-block";
                    return;
                }
                element.style.display = "block";
            });
        }
        if(condition === "login"){ // 登入情況
            // 隱藏註冊表單
            registerContent.forEach(element => {
                element.style.display = "none";
            });
            // 渲染登入表單
            loginContent.forEach(element => {
                element.style.display = "block";
            });
        }
    },
    // 移除 modal 輸入資料
    removeModalValues: function(){
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    },
    // 登入狀態：隱藏 login 按鈕； 顯示 logout 按鈕
    showLogoutBtn: function(){
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "block";
    },
    // 未登入狀態：顯示 login 按鈕； 隱藏 logout 按鈕
    showLoginBtn: function(){
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("logoutBtn").style.display = "none";
    },
    // 登入失敗：顯示錯誤訊息
    showLoginError: function(){
            let modalMessage = document.getElementById("modalMessage");
            modalMessage.textContent = modalModels.data.message;
            modalMessage.style.display = "block";
    },
    showLoginWarning: function(email, password){
        modalViews.removeWarning();
        let modalMessage = document.getElementById("modalMessage");
        let emailWarning = document.getElementById("emailWarning");
        let passwordWarning = document.getElementById("passwordWarning");
        if(email == ""){
            emailWarning.style.display = "inline";
            modalMessage.textContent = "請輸入帳號";
        }
        if(password == ""){
            passwordWarning.style.display = "inline";
            modalMessage.textContent = "請輸入密碼";
        }
        if(email == "" && password == ""){
            emailWarning.style.display = "inline";
            passwordWarning.style.display = "inline";
            modalMessage.textContent = "請輸入帳號及密碼";
        }
        modalMessage.style.display = "block";
    },
    showRegisterWarning: function(name, email, password){
        modalViews.removeWarning();
        let modalMessage = document.getElementById("modalMessage");
        let nameWarning = document.getElementById("nameWarning");
        let emailWarning = document.getElementById("emailWarning");
        let passwordWarning = document.getElementById("passwordWarning");
        if(password == ""){
            passwordWarning.style.display = "inline";
            modalMessage.textContent = "請輸入密碼";
        }
        if(email == ""){
            emailWarning.style.display = "inline";
            modalMessage.textContent = "請輸入信箱";
        }
        if(name == ""){
            nameWarning.style.display = "inline";
            modalMessage.textContent = "請輸入姓名";
        }
        if(name == "" && email == "" && password == "") {
            emailWarning.style.display = "inline";
            passwordWarning.style.display = "inline";
            modalMessage.textContent = "請輸入姓名、帳號及密碼";
        }
        modalMessage.style.display = "block";
    },
    // 註冊成功訊息
    showRegisterSuccess: function(){
        let modalMessage = document.getElementById("modalMessage");
        modalMessage.textContent = "註冊成功";
        modalMessage.style.display = "block";
    },
    // 註冊失敗訊息
    showRegisterError: function(){
        let modalMessage = document.getElementById("modalMessage");
        modalMessage.textContent = modalModels.data.message;
        modalMessage.style.display = "block";
    },
    // 移除警告訊息
    removeWarning: function(){
        document.getElementById("nameWarning").style.display = "none";
        document.getElementById("emailWarning").style.display = "none";
        document.getElementById("passwordWarning").style.display = "none";
    }
}

let modalControllers = {
    login: function(e){
        e.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if(email == "" || password == ""){
            modalViews.showLoginWarning(email, password);
        }
        else{
            modalModels.userLogin(email, password).then(() => {
                if(modalModels.data.ok){
                    modalViews.closeModal();
                    // 登入成功導回當前頁面
                    let current_url = window.location.pathname;
                    window.location.replace(current_url);
                }
                if(modalModels.data.error){
                    modalViews.showLoginError();
                }
            });
        }
    },
    register: function(e){
        e.preventDefault();
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if(name == "" || email == "" || password == ""){
            modalViews.showRegisterWarning(name , email, password);
        }
        else{
            modalViews.removeWarning();
            modalModels.checkInputFormat();
            if(modalModels.checkInputFormat()){
                modalModels.userRegister(name, email, password).then(() => {
                    if(modalModels.data.ok){
                        modalViews.removeModalValues();
                        modalViews.showRegisterSuccess();
                    }
                    if(modalModels.data.error){
                        modalViews.removeModalValues();
                        modalViews.showRegisterError();
                    }
                });
            }
        }
    },
    loginStatus: false,
    // 檢查會員登入狀態
    checkUserCondition: function(){
        modalModels.userInfo().then(() => {
            if(modalModels.data.data != null){
                modalViews.showLogoutBtn();
                modalControllers.loginStatus = true;
                localStorage.setItem("username", modalModels.data.data.name);
                localStorage.setItem("email", modalModels.data.data.email);
            }
            else{
                modalViews.showLoginBtn();
                modalControllers.loginStatus = false;
            }
        });
    },
    logout: function(){
        if(true){
            modalModels.userLogout().then(() => {
                // 登出成功，導回首頁
                if(modalModels.data.ok){
                    localStorage.removeItem("username");
                    localStorage.removeItem("email");
                    modalControllers.checkUserCondition();
                    window.location.replace("/");
                }
            });
        }
    },
    book: function(){
        if(modalControllers.loginStatus){
            window.location.replace("/booking");
        }
        else{
            modalViews.showModal();
        }
    }
}


window.addEventListener("click", (e) => modalViews.clickOutspaceCloseModal(e));
document.getElementById("loginBtn").addEventListener("click", () => modalViews.showModal());
document.getElementsByClassName("close")[0].addEventListener("click", () => modalViews.closeModal());
document.getElementById("doRegisterBtn").addEventListener("click", () => modalViews.renderModalContent("rigister"));
document.getElementById("doLoginBtn").addEventListener("click", () => modalViews.renderModalContent("login"));

window.addEventListener("load", () => modalControllers.checkUserCondition());
document.getElementById("login").addEventListener("click", (e) => modalControllers.login(e));
document.getElementById("register").addEventListener("click", (e) => modalControllers.register(e));
document.getElementById("logoutBtn").addEventListener("click", () => modalControllers.logout());

document.getElementById("bookingBtn").addEventListener("click", () => modalControllers.book());