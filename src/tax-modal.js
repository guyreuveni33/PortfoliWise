document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.calculate-tax-button').addEventListener('click', function () {
        document.getElementById('calculateTaxModal').style.display = 'block';
    });

    document.querySelector('.port-close').addEventListener('click', function () {
        document.getElementById('calculateTaxModal').style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == document.getElementById('calculateTaxModal')) {
            document.getElementById('calculateTaxModal').style.display = 'none';
        }
    });
});function openModal() {
    document.getElementById("myModal").style.display = "block";
}