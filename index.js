document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll(".photo-row");

    rows.forEach((row, index) => {
        const direction = (index + 1) % 2 === 0 ? 1 : -1; // Odd rows move up (-1), even rows move down (1)
        let position = 0;

        function slideRow() {
            position += direction * 2; // Adjust this value to change the speed
            if (position >= row.clientHeight || position <= -row.clientHeight) {
                direction *= -1; // Reverse direction
            }
            row.style.transform = `translateY(${position}px)`;
            requestAnimationFrame(slideRow);
        }

        slideRow();
    });
});
