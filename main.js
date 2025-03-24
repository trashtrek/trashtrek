document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
