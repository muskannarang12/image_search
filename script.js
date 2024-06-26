const form = document.querySelector('form');
const imageContainer = document.querySelector('.image_container');
const loadMoreButton = document.getElementById('loadMore');
const accessKey = '44578496-0007402da9df35cd0e6b3e131';
let currentPage = 1;
let currentQuery = '';

imageContainer.innerHTML = 'NO IMAGE TO SHOW';

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    currentQuery = form.elements[0].value; // Store the current query
    currentPage = 1; // Reset to the first page
    imageContainer.innerHTML = ''; // Clear previous images
    getwordInfo(currentQuery, currentPage);
});

loadMoreButton.addEventListener('click', () => {
    currentPage++; // Increment the page number
    getwordInfo(currentQuery, currentPage);
});

const getwordInfo = async (query, page) => {
    const url = `https://pixabay.com/api/?key=${accessKey}&q=${encodeURIComponent(query)}&image_type=photo&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        displayImages(data.hits);
        if (data.hits.length > 0) {
            loadMoreButton.style.display = 'flex'; // Show the "Load More" button
        
        } else {

            loadMoreButton.style.display = 'none'; // Hide the "Load More" button if no more images
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        imageContainer.innerHTML = 'Error fetching images';
    }
};

const displayImages = (images) => {
    if (images.length === 0 && currentPage === 1) {
        imageContainer.innerHTML = 'No images found';
        return;
    }
    
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags;
        imageContainer.appendChild(imgElement);
    });
};
