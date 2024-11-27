let navMenuShow = function () {
  let navMenu = document.getElementById("navBar");
  let lineOne = document.getElementById("line1");
  let lineTwo = document.getElementById("line2");
  let lineThree = document.getElementById("line3");
  let hamburger = document.getElementById("hamburger");
  let hamburgerLines = document.getElementsByClassName("hamburgerLine");

  if (navMenu.style.left === "0px") {
    navMenu.style.left = "-300px";
    // hamburger animation
    lineOne.style.transform = "rotate(0deg)";
    lineTwo.style.width = "32px";
    lineThree.style.transform = "rotate(0deg)";
    hamburger.style.transform = "rotate(0deg)";
    for (let line of hamburgerLines) {
      line.style.backgroundColor = "#473721";
    }
  } else {
    navMenu.style.left = "0";
    lineOne.style.transform = "translateY(10px) rotate(45deg)";
    lineTwo.style.width = "0px";
    lineThree.style.transform =
      "translateX(-27px) translateY(1px) rotate(135deg)";
    hamburger.style.transform = "rotate(-90deg)";
    for (let line of hamburgerLines) {
      line.style.backgroundColor = "#fff";
    }
  }
};

document.getElementById("hamburger").addEventListener("click", navMenuShow);
