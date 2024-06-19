console.log("Script is loaded");

function myFunction() {
  setTimeout(() => {
    document.getElementsByTagName("h1")[0].innerText = "hello";
  }, 3000);
}
myFunction();
