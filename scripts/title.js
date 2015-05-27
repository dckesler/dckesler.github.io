var titles = ["Butters his arteries for maximum speed.", "Falls down stairs to save time.", "Never went to Prom.", "Has an inexplicably deep prostate.", "Was in the bathroom for rapture."];
document.getElementById("myTitle").innerHTML = titles[Math.floor(Math.random()*titles.length)];
setInterval(function(){
    document.getElementById("myTitle").innerHTML = titles[Math.floor(Math.random()*titles.length)];
}, 10000);
