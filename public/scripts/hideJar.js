const hide = function(){
  const jar = document.getElementById("jar");
  jar.style.visibility = "hidden";
  setTimeout(()=>jar.style.visibility = "visible",1000)
}