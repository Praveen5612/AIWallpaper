// ======= Global Variables =======
let categories = [];
let featuredWallpapers = [];
let trendingWallpapers = [];
let allWallpapers = [];
let selectedWallpaper = null;

// ======= DOM Elements =======
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const wallpaperModal = document.getElementById('wallpaper-modal');
const modalClose = document.getElementById('modal-close');
const modalContent = document.getElementById('modal-content');
const modalOverlay = document.querySelector('.modal-overlay');

// ======= Event Listeners =======
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Modal close events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && wallpaperModal && wallpaperModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Footer categories
    fetchAndPopulateFooterCategories();
});

// ======= Mobile Menu Functions =======
function openMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ======= Modal Functions =======
function openModal(wallpaper) {
    selectedWallpaper = wallpaper;
    
    if (wallpaperModal) {
        // Add content to modal
        populateModal();
        
        // Show modal
        wallpaperModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (wallpaperModal) {
        wallpaperModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function populateModal() {
    if (!modalContent || !selectedWallpaper) return;
    
    // Format the date nicely
    const createdDate = new Date(selectedWallpaper.createdAt);
    const formattedDate = createdDate.toISOString().split('T')[0];
    
    // Get similar wallpapers
    let similarWallpapers = [];
    if (allWallpapers.length > 0) {
        similarWallpapers = allWallpapers
            .filter(w => 
                w.categoryId === selectedWallpaper.categoryId && 
                w.id !== selectedWallpaper.id
            )
            .slice(0, 5);
    }
    
    // Create modal HTML
    modalContent.innerHTML = `
        <div class="wallpaper-preview">
            <img src="${selectedWallpaper.imageUrl}" alt="${selectedWallpaper.title}">
        </div>
        <div class="wallpaper-details">
            <h2 class="wallpaper-details-title">${selectedWallpaper.title}</h2>
            
            <div class="details-section">
                <h3 class="details-heading">Description</h3>
                <p class="wallpaper-description">${selectedWallpaper.description}</p>
            </div>
            
            <div class="details-section">
                <h3 class="details-heading">Details</h3>
                <table class="details-table">
                    <tr>
                        <td>Resolution</td>
                        <td class="resolution-value">${selectedWallpaper.width} x ${selectedWallpaper.height}</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td class="category-value">${selectedWallpaper.tags[0]}</td>
                    </tr>
                    <tr>
                        <td>File Size</td>
                        <td>${selectedWallpaper.fileSize}</td>
                    </tr>
                    <tr>
                        <td>Format</td>
                        <td>${selectedWallpaper.format}</td>
                    </tr>
                    <tr>
                        <td>Date Added</td>
                        <td>${formattedDate}</td>
                    </tr>
                </table>
            </div>
            
            <div class="details-section">
                <h3 class="details-heading">Tags</h3>
                <div class="details-tags">
                    ${selectedWallpaper.tags.map(tag => `
                        <a href="/search?q=${encodeURIComponent(tag)}" class="details-tag">${tag}</a>
                    `).join('')}
                </div>
            </div>
            
            <div class="details-section">
                <button class="download-button" onclick="downloadWallpaper()">
                    <i class="ri-download-line"></i> Download Wallpaper
                </button>
            </div>
            
            <div class="details-section">
                <h3 class="details-heading">Share</h3>
                <div class="share-links">
                    <a href="#" class="share-link" onclick="shareWallpaper('facebook')">
                        <i class="ri-facebook-fill"></i>
                    </a>
                    <a href="#" class="share-link" onclick="shareWallpaper('twitter')">
                        <i class="ri-twitter-x-fill"></i>
                    </a>
                    <a href="#" class="share-link" onclick="shareWallpaper('pinterest')">
                        <i class="ri-pinterest-fill"></i>
                    </a>
                    <a href="#" class="share-link" onclick="shareWallpaper('link')">
                        <i class="ri-link"></i>
                    </a>
                </div>
            </div>
        </div>
        
        ${similarWallpapers.length > 0 ? `
            <div class="similar-section" style="grid-column: 1 / -1;">
                <h3 class="similar-heading">You May Also Like</h3>
                
                <div class="similar-grid">
                    ${similarWallpapers.map(wallpaper => `
                        <a class="similar-wallpaper" href="/wallpaper/${wallpaper.slug}">
                            <div class="similar-wallpaper-image">
                                <img src="${wallpaper.imageUrl}" alt="${wallpaper.title}">
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

// ======= Download Function =======
function downloadWallpaper() {
    if (!selectedWallpaper) return;
    
    // In a real implementation, this would handle premium vs. free downloads
    // For now, just open the image in a new tab
    window.open(selectedWallpaper.imageUrl, '_blank');
    
    // Show toast or notification
    alert('Download started for: ' + selectedWallpaper.title);
}

// ======= Share Functions =======
function shareWallpaper(platform) {
    if (!selectedWallpaper) return;
    
    const url = window.location.origin + '/wallpaper/' + selectedWallpaper.slug;
    const title = selectedWallpaper.title;
    
    switch (platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            break;
        case 'pinterest':
            window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(selectedWallpaper.imageUrl)}&description=${encodeURIComponent(title)}`, '_blank');
            break;
        case 'link':
            // Copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
            break;
    }
}

// ======= API Functions =======
// Load categories
function fetchCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    
    if (!categoriesGrid) return;
    
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            categories = data;
            
            // Clear skeleton loading
            categoriesGrid.innerHTML = '';
            
            // Populate categories
            data.forEach(category => {
                const categoryCard = document.createElement('a');
                categoryCard.href = `/category/${category.slug}`;
                categoryCard.className = 'category-card';
                
                categoryCard.innerHTML = `
                    <img src="${category.imageUrl}" alt="${category.name}">
                    <div class="category-info">
                        <h3 class="category-card-title">${category.name}</h3>
                        <span class="category-card-count">${category.count} wallpapers</span>
                    </div>
                `;
                
                categoriesGrid.appendChild(categoryCard);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            categoriesGrid.innerHTML = '<div class="error-message">Failed to load categories. Please try again later.</div>';
        });
}

// Load featured wallpapers
function fetchFeaturedWallpapers() {
    const featuredGrid = document.getElementById('featured-wallpapers');
    
    if (!featuredGrid) return;
    
    fetch('/api/wallpapers/featured')
        .then(response => response.json())
        .then(data => {
            featuredWallpapers = data;
            
            // Clear skeleton loading
            featuredGrid.innerHTML = '';
            
            // Populate featured wallpapers
            data.forEach(wallpaper => {
                const wallpaperCard = document.createElement('div');
                wallpaperCard.className = 'wallpaper-card';
                wallpaperCard.onclick = () => openModal(wallpaper);
                
                wallpaperCard.innerHTML = `
                    <div class="wallpaper-card-image gradient-border">
                        <img src="${wallpaper.imageUrl}" alt="${wallpaper.title}">
                        <div class="wallpaper-card-overlay">
                            <div class="wallpaper-card-tags">
                                <span class="wallpaper-tag wallpaper-tag-4k">4K</span>
                                ${wallpaper.isNew ? '<span class="wallpaper-tag wallpaper-tag-new">New</span>' : ''}
                                ${wallpaper.isPopular ? '<span class="wallpaper-tag wallpaper-tag-popular">Popular</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <h3 class="wallpaper-card-title">${wallpaper.title}</h3>
                    <div class="wallpaper-card-meta">
                        <span>${wallpaper.width} x ${wallpaper.height}</span>
                        <span class="meta-separator"></span>
                        <span>${wallpaper.tags[0]}</span>
                    </div>
                `;
                
                featuredGrid.appendChild(wallpaperCard);
            });
            
            // Initialize slider controls
            initFeaturedSlider();
        })
        .catch(error => {
            console.error('Error fetching featured wallpapers:', error);
            featuredGrid.innerHTML = '<div class="error-message">Failed to load featured wallpapers. Please try again later.</div>';
        });
}

// Initialize featured slider
function initFeaturedSlider() {
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');
    const featuredGrid = document.getElementById('featured-wallpapers');
    
    if (!prevBtn || !nextBtn || !featuredGrid) return;
    
    // Simple slider implementation
    // In a production app, you might want to use a more robust solution
    let scrollAmount = 0;
    const cardWidth = 300; // Approximate width of a card
    
    prevBtn.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - cardWidth, 0);
        featuredGrid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        scrollAmount = Math.min(scrollAmount + cardWidth, featuredGrid.scrollWidth - featuredGrid.clientWidth);
        featuredGrid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

// Load trending wallpapers
function fetchTrendingWallpapers() {
    const trendingGrid = document.getElementById('trending-wallpapers');
    
    if (!trendingGrid) return;
    
    fetch('/api/wallpapers/trending')
        .then(response => response.json())
        .then(data => {
            trendingWallpapers = data;
            
            // Clear skeleton loading
            trendingGrid.innerHTML = '';
            
            // Populate trending wallpapers
            data.forEach(wallpaper => {
                const masonryItem = document.createElement('div');
                masonryItem.className = 'masonry-item';
                
                masonryItem.innerHTML = `
                    <div class="masonry-card" onclick="openModal(${JSON.stringify(wallpaper).replace(/"/g, '&quot;')})">
                        <div class="masonry-card-image gradient-border">
                            <img src="${wallpaper.imageUrl}" alt="${wallpaper.title}">
                            <div class="masonry-card-overlay">
                                <div class="wallpaper-card-tags">
                                    <span class="wallpaper-tag wallpaper-tag-4k">4K</span>
                                    ${wallpaper.isNew ? '<span class="wallpaper-tag wallpaper-tag-new">New</span>' : ''}
                                    ${wallpaper.isPopular ? '<span class="wallpaper-tag wallpaper-tag-popular">Popular</span>' : ''}
                                </div>
                                <button class="download-btn" onclick="event.stopPropagation(); window.open('${wallpaper.imageUrl}', '_blank')">
                                    <i class="ri-download-line"></i>
                                </button>
                            </div>
                        </div>
                        <h3 class="masonry-card-title">${wallpaper.title}</h3>
                    </div>
                `;
                
                trendingGrid.appendChild(masonryItem);
            });
        })
        .catch(error => {
            console.error('Error fetching trending wallpapers:', error);
            trendingGrid.innerHTML = '<div class="error-message">Failed to load trending wallpapers. Please try again later.</div>';
        });
}

// Fetch all wallpapers
function fetchAllWallpapers() {
    fetch('/api/wallpapers')
        .then(response => response.json())
        .then(data => {
            allWallpapers = data;
            
            // If we're on the category page, display the wallpapers
            const categoryWallpapers = document.getElementById('category-wallpapers');
            if (categoryWallpapers) {
                document.getElementById('category-wallpapers').innerHTML = '';
                
                if (data.length === 0) {
                    document.getElementById('no-wallpapers').style.display = 'block';
                    document.getElementById('load-more-btn').style.display = 'none';
                } else {
                    document.getElementById('category-description').textContent = `Browse our entire collection of ${data.length} AI-generated wallpapers.`;
                    displayWallpapers();
                }
            }
        })
        .catch(error => {
            console.error('Error fetching all wallpapers:', error);
            if (document.getElementById('category-wallpapers')) {
                document.getElementById('category-wallpapers').innerHTML = '<div class="error-message">Failed to load wallpapers. Please try again later.</div>';
            }
        });
}

// Fetch category
function fetchCategory(slug) {
    fetch(`/api/categories/${slug}`)
        .then(response => response.json())
        .then(data => {
            // Update category title and description
            document.getElementById('category-title').textContent = data.name;
            document.getElementById('category-description').textContent = `Browse our collection of ${data.count} ${data.name} wallpapers.`;
            document.title = `${data.name} | WallpaperAI`;
            
            // Fetch wallpapers for this category
            fetchWallpapersByCategory(slug);
        })
        .catch(error => {
            console.error('Error fetching category:', error);
            document.getElementById('category-title').textContent = 'Category Not Found';
            document.getElementById('category-description').textContent = 'The requested category could not be found.';
            document.getElementById('no-wallpapers').style.display = 'block';
            document.getElementById('load-more-btn').style.display = 'none';
        });
}

// Fetch wallpapers by category
function fetchWallpapersByCategory(slug) {
    fetch(`/api/categories/${slug}/wallpapers`)
        .then(response => response.json())
        .then(data => {
            allWallpapers = data;
            
            document.getElementById('category-wallpapers').innerHTML = '';
            
            if (data.length === 0) {
                document.getElementById('no-wallpapers').style.display = 'block';
                document.getElementById('load-more-btn').style.display = 'none';
            } else {
                displayWallpapers();
            }
        })
        .catch(error => {
            console.error('Error fetching wallpapers by category:', error);
            document.getElementById('category-wallpapers').innerHTML = '<div class="error-message">Failed to load wallpapers. Please try again later.</div>';
        });
}

// Fetch wallpaper details
function fetchWallpaperDetails(slug) {
    const wallpaperDetail = document.getElementById('wallpaper-detail');
    const similarWallpapers = document.getElementById('similar-wallpapers');
    
    if (!wallpaperDetail) return;
    
    fetch(`/api/wallpapers/${slug}`)
        .then(response => response.json())
        .then(data => {
            selectedWallpaper = data;
            
            // Clear skeleton loading
            wallpaperDetail.innerHTML = '';
            
            // Populate wallpaper details
            wallpaperDetail.innerHTML = `
                <div class="wallpaper-image">
                    <img src="${data.imageUrl}" alt="${data.title}">
                </div>
                <div class="wallpaper-info">
                    <h1 class="wallpaper-details-title">${data.title}</h1>
                    
                    <div class="details-section">
                        <h2 class="details-heading">Description</h2>
                        <p class="wallpaper-description">${data.description}</p>
                    </div>
                    
                    <div class="details-section">
                        <h2 class="details-heading">Details</h2>
                        <table class="details-table">
                            <tr>
                                <td>Resolution</td>
                                <td class="resolution-value">${data.width} x ${data.height}</td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td class="category-value">${data.tags[0]}</td>
                            </tr>
                            <tr>
                                <td>File Size</td>
                                <td>${data.fileSize}</td>
                            </tr>
                            <tr>
                                <td>Format</td>
                                <td>${data.format}</td>
                            </tr>
                            <tr>
                                <td>Date Added</td>
                                <td>${new Date(data.createdAt).toISOString().split('T')[0]}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="details-section">
                        <h2 class="details-heading">Tags</h2>
                        <div class="details-tags">
                            ${data.tags.map(tag => `
                                <a href="/search?q=${encodeURIComponent(tag)}" class="details-tag">${tag}</a>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <button class="download-button" onclick="downloadWallpaper()">
                            <i class="ri-download-line"></i> Download Wallpaper
                        </button>
                    </div>
                    
                    <div class="details-section">
                        <h2 class="details-heading">Share</h2>
                        <div class="share-links">
                            <a href="#" class="share-link" onclick="shareWallpaper('facebook')">
                                <i class="ri-facebook-fill"></i>
                            </a>
                            <a href="#" class="share-link" onclick="shareWallpaper('twitter')">
                                <i class="ri-twitter-x-fill"></i>
                            </a>
                            <a href="#" class="share-link" onclick="shareWallpaper('pinterest')">
                                <i class="ri-pinterest-fill"></i>
                            </a>
                            <a href="#" class="share-link" onclick="shareWallpaper('link')">
                                <i class="ri-link"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Set page title
            document.title = `${data.title} | WallpaperAI`;
            
            // Fetch all wallpapers to find similar ones
            fetch('/api/wallpapers')
                .then(response => response.json())
                .then(wallpapers => {
                    allWallpapers = wallpapers;
                    
                    // Find similar wallpapers by category
                    const similar = wallpapers
                        .filter(w => 
                            w.categoryId === data.categoryId && 
                            w.id !== data.id
                        )
                        .slice(0, 5);
                    
                    // Clear skeleton loading
                    similarWallpapers.innerHTML = '';
                    
                    // Populate similar wallpapers
                    similar.forEach(wallpaper => {
                        const similarCard = document.createElement('a');
                        similarCard.href = `/wallpaper/${wallpaper.slug}`;
                        similarCard.className = 'similar-wallpaper';
                        
                        similarCard.innerHTML = `
                            <div class="similar-wallpaper-image">
                                <img src="${wallpaper.imageUrl}" alt="${wallpaper.title}">
                            </div>
                        `;
                        
                        similarWallpapers.appendChild(similarCard);
                    });
                })
                .catch(error => {
                    console.error('Error fetching similar wallpapers:', error);
                    similarWallpapers.innerHTML = '<div class="error-message">Failed to load similar wallpapers.</div>';
                });
        })
        .catch(error => {
            console.error('Error fetching wallpaper details:', error);
            wallpaperDetail.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1;">
                    <i class="ri-image-line no-results-icon"></i>
                    <h2 class="no-results-title">Wallpaper Not Found</h2>
                    <p class="no-results-message">The requested wallpaper could not be found.</p>
                    <a href="/" class="btn btn-primary" style="margin-top: 20px;">Go to Homepage</a>
                </div>
            `;
        });
}

// Search wallpapers
function searchWallpapers(query) {
    if (!query) return;
    
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            allWallpapers = data;
            
            document.getElementById('search-results').innerHTML = '';
            document.getElementById('search-count').textContent = `Found ${data.length} wallpapers`;
            
            if (data.length === 0) {
                document.getElementById('no-results').style.display = 'block';
                document.getElementById('load-more-btn').style.display = 'none';
            } else {
                document.getElementById('no-results').style.display = 'none';
                displaySearchResults();
            }
        })
        .catch(error => {
            console.error('Error searching wallpapers:', error);
            document.getElementById('search-results').innerHTML = '<div class="error-message">Failed to perform search. Please try again later.</div>';
        });
}

// Display wallpapers with pagination (for category and search pages)
function displayWallpapers() {
    const wallpapersGrid = document.getElementById('category-wallpapers');
    if (!wallpapersGrid || !allWallpapers.length) return;
    
    const start = 0;
    const end = page * itemsPerPage;
    const wallpapersToShow = allWallpapers.slice(start, end);
    
    // Clear grid
    wallpapersGrid.innerHTML = '';
    
    // Add wallpapers
    wallpapersToShow.forEach(wallpaper => {
        const masonryItem = document.createElement('div');
        masonryItem.className = 'masonry-item';
        
        masonryItem.innerHTML = `
            <div class="masonry-card" onclick="openModal(${JSON.stringify(wallpaper).replace(/"/g, '&quot;')})">
                <div class="masonry-card-image gradient-border">
                    <img src="${wallpaper.imageUrl}" alt="${wallpaper.title}">
                    <div class="masonry-card-overlay">
                        <div class="wallpaper-card-tags">
                            <span class="wallpaper-tag wallpaper-tag-4k">4K</span>
                            ${wallpaper.isNew ? '<span class="wallpaper-tag wallpaper-tag-new">New</span>' : ''}
                            ${wallpaper.isPopular ? '<span class="wallpaper-tag wallpaper-tag-popular">Popular</span>' : ''}
                        </div>
                        <button class="download-btn" onclick="event.stopPropagation(); window.open('${wallpaper.imageUrl}', '_blank')">
                            <i class="ri-download-line"></i>
                        </button>
                    </div>
                </div>
                <h3 class="masonry-card-title">${wallpaper.title}</h3>
            </div>
        `;
        
        wallpapersGrid.appendChild(masonryItem);
    });
    
    // Update "hasMore" flag
    hasMore = wallpapersToShow.length < allWallpapers.length;
    
    // Hide "Load More" button if no more wallpapers
    if (!hasMore) {
        document.getElementById('load-more-btn').style.display = 'none';
    }
}

// Display search results
function displaySearchResults() {
    const resultsGrid = document.getElementById('search-results');
    if (!resultsGrid || !allWallpapers.length) return;
    
    const start = 0;
    const end = page * itemsPerPage;
    const wallpapersToShow = allWallpapers.slice(start, end);
    
    // Clear grid
    resultsGrid.innerHTML = '';
    
    // Add wallpapers
    wallpapersToShow.forEach(wallpaper => {
        const masonryItem = document.createElement('div');
        masonryItem.className = 'masonry-item';
        
        masonryItem.innerHTML = `
            <div class="masonry-card" onclick="openModal(${JSON.stringify(wallpaper).replace(/"/g, '&quot;')})">
                <div class="masonry-card-image gradient-border">
                    <img src="${wallpaper.imageUrl}" alt="${wallpaper.title}">
                    <div class="masonry-card-overlay">
                        <div class="wallpaper-card-tags">
                            <span class="wallpaper-tag wallpaper-tag-4k">4K</span>
                            ${wallpaper.isNew ? '<span class="wallpaper-tag wallpaper-tag-new">New</span>' : ''}
                            ${wallpaper.isPopular ? '<span class="wallpaper-tag wallpaper-tag-popular">Popular</span>' : ''}
                        </div>
                        <button class="download-btn" onclick="event.stopPropagation(); window.open('${wallpaper.imageUrl}', '_blank')">
                            <i class="ri-download-line"></i>
                        </button>
                    </div>
                </div>
                <h3 class="masonry-card-title">${wallpaper.title}</h3>
            </div>
        `;
        
        resultsGrid.appendChild(masonryItem);
    });
    
    // Update "hasMore" flag
    hasMore = wallpapersToShow.length < allWallpapers.length;
    
    // Hide "Load More" button if no more wallpapers
    if (!hasMore) {
        document.getElementById('load-more-btn').style.display = 'none';
    }
}

// Subscribe to newsletter
function subscribeToNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    const messageElement = document.getElementById('newsletter-message');
    const subscribeBtn = document.getElementById('subscribe-btn');
    
    if (!email || !messageElement) return;
    
    // Disable button and show loading state
    if (subscribeBtn) {
        subscribeBtn.disabled = true;
        subscribeBtn.textContent = 'Subscribing...';
    }
    
    fetch('/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
        .then(response => response.json())
        .then(data => {
            messageElement.textContent = data.message;
            messageElement.className = 'form-message';
            
            // Clear input on success
            document.getElementById('newsletter-email').value = '';
        })
        .catch(error => {
            console.error('Error subscribing to newsletter:', error);
            messageElement.textContent = 'Failed to subscribe. Please try again later.';
            messageElement.className = 'form-message error';
        })
        .finally(() => {
            // Re-enable button
            if (subscribeBtn) {
                subscribeBtn.disabled = false;
                subscribeBtn.textContent = 'Subscribe';
            }
        });
}

// Fetch categories for footer
function fetchAndPopulateFooterCategories() {
    const footerCategories = document.getElementById('footer-categories');
    
    if (!footerCategories) return;
    
    fetch('/api/categories')
        .then(response => response.json())
        .then(data => {
            categories = data;
            
            // Clear existing links
            footerCategories.innerHTML = '';
            
            // Populate footer categories
            data.forEach(category => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `/category/${category.slug}`;
                link.className = 'footer-link';
                link.textContent = category.name;
                
                li.appendChild(link);
                footerCategories.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching footer categories:', error);
        });
}