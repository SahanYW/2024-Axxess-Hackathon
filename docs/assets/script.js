document.querySelectorAll('.symptom-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Toggle the active class on the clicked button
        this.classList.toggle('symptom-btn-active');
    });
});
