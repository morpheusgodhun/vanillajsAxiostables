document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const sortButton = document.getElementById('sortButton');
    const sortByPriceAscLink = document.getElementById('sortByPriceAsc');
    const sortByPriceDescLink = document.getElementById('sortByPriceDesc');
    const sortByDateAscLink = document.getElementById('sortByDateAsc');
    const sortByDateDescLink = document.getElementById('sortByDateDesc');
    const sortAlphabeticalAscLink = document.getElementById('sortAlphabeticalAsc');
    const sortAlphabeticalDescLink = document.getElementById('sortAlphabeticalDesc');
    const sortDropdown = document.getElementById('sortDropdown');
    const exportButton = document.getElementById('exportButton');

    let productsData = [];
    let priceSortDirection = 'desc'; // Varsayılan fiyat sıralama yönü
    let dateSortDirection = 'desc'; // Varsayılan tarih sıralama yönü
    let alphabeticalSortDirection = 'asc'; // Varsayılan alfabetik sıralama yönü

    function fetchData() {
        axios.get('https://fakestoreapi.com/products')
            .then(function(response) {
                productsData = response.data;
                populateTable(productsData);
            })
            .catch(function(error) {
                console.error('Error fetching data:', error);
            });
    }

    function populateTable(data) {
        dataTable.innerHTML = '';
        data.forEach(function(item) {
            const row = dataTable.insertRow();
            row.insertCell(0).textContent = item.id;
            row.insertCell(1).textContent = item.title;
            row.insertCell(2).textContent = `$${item.price.toFixed(2)}`;
            const releaseDate = new Date(item.date || "2023-01-01").toLocaleDateString();
            row.insertCell(3).textContent = releaseDate; 
        });
    }

    function filterTable(event) {
        const filter = event.target.value;
        const rows = dataTable.getElementsByTagName('tr');
        Array.from(rows).forEach(function(row) {
            const cells = row.getElementsByTagName('td');
            let match = false;
            Array.from(cells).forEach(function(cell) {
                if (cell.textContent.includes(filter)) {
                    match = true;
                }
            });
            row.style.display = match ? '' : 'none';
        });
    }

    function sortByPriceAsc() {
        const sortedData = productsData.slice().sort((a, b) => a.price - b.price);
        populateTable(sortedData);
        priceSortDirection = 'asc'; 
    }

    function sortByPriceDesc() {
        const sortedData = productsData.slice().sort((a, b) => b.price - a.price);
        populateTable(sortedData);
        priceSortDirection = 'desc'; 
    }

    function sortByDateAsc() {
        const sortedData = productsData.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        populateTable(sortedData);
        dateSortDirection = 'asc'; 
    }

    function sortByDateDesc() {
        const sortedData = productsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        populateTable(sortedData);
        dateSortDirection = 'desc'; 
    }

    function sortAlphabeticalAsc() {
        const sortedData = productsData.slice().sort((a, b) => a.title.localeCompare(b.title));
        populateTable(sortedData);
        alphabeticalSortDirection = 'asc'; 
    }

    function sortAlphabeticalDesc() {
        const sortedData = productsData.slice().sort((a, b) => b.title.localeCompare(a.title));
        populateTable(sortedData);
        alphabeticalSortDirection = 'desc'; 
    }

    sortButton.addEventListener('click', function() {
        sortDropdown.classList.toggle('show');
    });

    sortByPriceAscLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortByPriceAsc();
        sortDropdown.classList.remove('show'); 
    });

    sortByPriceDescLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortByPriceDesc();
        sortDropdown.classList.remove('show'); 
    });

    sortByDateAscLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortByDateAsc();
        sortDropdown.classList.remove('show'); 
    });

    sortByDateDescLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortByDateDesc();
        sortDropdown.classList.remove('show'); 
    });

    sortAlphabeticalAscLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortAlphabeticalAsc();
        sortDropdown.classList.remove('show'); 
    });

    sortAlphabeticalDescLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortAlphabeticalDesc();
        sortDropdown.classList.remove('show'); 
    });

    searchInput.addEventListener('input', filterTable);

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.sort-button')) {
            if (sortDropdown.classList.contains('show')) {
                sortDropdown.classList.remove('show');
            }
        }
    });

    exportButton.addEventListener('click', function() {
        exportToCsv('products.csv', productsData);
    });

    fetchData();
});

function exportToCsv(filename, data) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // CSV başlık satırı
    const headers = Object.keys(data[0]).join(',');
    csvContent += headers + '\n';

    // Her bir veri satırı
    data.forEach(function(row) {
        const values = Object.values(row).join(',');
        csvContent += values + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
}

