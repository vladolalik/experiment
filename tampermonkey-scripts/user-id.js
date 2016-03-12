function setUserCookies(){
    var name = "fero";
    document.cookie="username="+name;
    console.log("Cookies has been updated");
    return name;
}