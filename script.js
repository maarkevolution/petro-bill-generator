// Petro Bill Generator
// Version 1.0

const buttons = document.querySelectorAll(".grid button");

buttons.forEach((button) => {
    button.addEventListener("click", function () {
        alert("You selected: " + this.innerText);

        // अगले स्टेप में यहीं से Bill Generator खुलेगा।
    });
});
