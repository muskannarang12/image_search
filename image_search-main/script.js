const form = document.querySelector('form');
        const imageContainer = document.querySelector('.image_container');
        const paginationContainer = document.getElementById('pagination');
        const searchCountElement = document.getElementById('searchCount');
        const loader = document.getElementById('loader');
        const searchInput = document.getElementById('searchInput');
        const accessKey = '44578496-0007402da9df35cd0e6b3e131';
        let currentPage = 1;
        let currentQuery = '';
        let totalPages = 1;
        let totalHits = 0;

        // Show loading state
        const showLoading = () => {
            loader.style.display = 'block';
            imageContainer.innerHTML = '';
            
            // Add skeleton loading cards
            for (let i = 0; i < 6; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-card';
                imageContainer.appendChild(skeleton);
            }
        };

        // Hide loading state
        const hideLoading = () => {
            loader.style.display = 'none';
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            currentQuery = searchInput.value.trim();
            if (!currentQuery) return;
            
            currentPage = 1;
            showLoading();
            getImageInfo(currentQuery, currentPage);
        });

        const getImageInfo = async (query, page) => {
            try {
                const url = `https://pixabay.com/api/?key=${accessKey}&q=${encodeURIComponent(query)}&image_type=photo&page=${page}&per_page=12`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                totalHits = data.totalHits;
                totalPages = Math.ceil(totalHits / 12);
                
                displayImages(data.hits);
                updateSearchCount();
                createPagination();
                
            } catch (error) {
                console.error('Error fetching data:', error);
                imageContainer.innerHTML = '<div class="no-results">Error fetching images. Please try again.</div>';
                paginationContainer.innerHTML = '';
                searchCountElement.textContent = '';
            } finally {
                hideLoading();
            }
        };

        const displayImages = (images) => {
            if (images.length === 0) {
                imageContainer.innerHTML = '<div class="no-results">No images found. Try a different search term.</div>';
                paginationContainer.innerHTML = '';
                searchCountElement.textContent = '';
                return;
            }
            
            imageContainer.innerHTML = '';
            
            images.forEach(image => {
                const card = document.createElement('div');
                card.className = 'image-card';
                
                const imgElement = document.createElement('img');
                imgElement.src = image.webformatURL;
                imgElement.alt = image.tags;
                imgElement.loading = "lazy";
                
                // Add loading state for individual images
                imgElement.onload = () => {
                    imgElement.style.opacity = 1;
                };
                imgElement.style.opacity = 0;
                imgElement.style.transition = 'opacity 0.3s ease';
                
                const desc = document.createElement('p');
                desc.textContent = image.tags.split(',').slice(0, 2).join(', ').toUpperCase();
                
                card.appendChild(imgElement);
                card.appendChild(desc);
                imageContainer.appendChild(card);
            });
        };

        const updateSearchCount = () => {
            if (totalHits > 0) {
                searchCountElement.textContent = `Found ${totalHits.toLocaleString()} images | Page ${currentPage} of ${totalPages}`;
            } else {
                searchCountElement.textContent = '';
            }
        };

        const createPagination = () => {
            paginationContainer.innerHTML = '';
            
            if (totalPages <= 1) return;
            
            // Previous button
            if (currentPage > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.innerHTML = '<i class="bx bx-chevron-left"></i>';
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    showLoading();
                    getImageInfo(currentQuery, currentPage);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
                paginationContainer.appendChild(prevBtn);
            }
            
            // Page buttons
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            // Adjust if we're at the end
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            // First page button if needed
            if (startPage > 1) {
                const firstBtn = document.createElement('button');
                firstBtn.textContent = '1';
                firstBtn.addEventListener('click', () => {
                    currentPage = 1;
                    showLoading();
                    getImageInfo(currentQuery, currentPage);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
                paginationContainer.appendChild(firstBtn);
                
                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.style.padding = '10px';
                    ellipsis.style.color = '#8a8a8a';
                    paginationContainer.appendChild(ellipsis);
                }
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                if (i === currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    showLoading();
                    getImageInfo(currentQuery, currentPage);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
                paginationContainer.appendChild(pageBtn);
            }
            
            // Last page button if needed
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.style.padding = '10px';
                    ellipsis.style.color = '#8a8a8a';
                    paginationContainer.appendChild(ellipsis);
                }
                
                const lastBtn = document.createElement('button');
                lastBtn.textContent = totalPages;
                lastBtn.addEventListener('click', () => {
                    currentPage = totalPages;
                    showLoading();
                    getImageInfo(currentQuery, currentPage);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
                paginationContainer.appendChild(lastBtn);
            }
            
            // Next button
            if (currentPage < totalPages) {
                const nextBtn = document.createElement('button');
                nextBtn.innerHTML = '<i class="bx bx-chevron-right"></i>';
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    showLoading();
                    getImageInfo(currentQuery, currentPage);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
                paginationContainer.appendChild(nextBtn);
            }
        };

        // Initialize with popular images if desired
        // window.addEventListener('DOMContentLoaded', () => {
        //     getImageInfo('nature', 1);
        // });