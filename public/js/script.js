// Select the header element
const header = document.querySelector('header');

// Function to add/remove the class based on scroll position
function toggleHeaderOnScroll() {
    if (window.scrollY > 0) { // Check if the page has been scrolled
        header.classList.add('scrolled'); // Add class to fix header
    } else {
        header.classList.remove('scrolled'); // Remove class to return to normal position
    }
}

// Call the function on page load to ensure proper initial state
window.addEventListener('load', toggleHeaderOnScroll);
// Add event listener for scroll events
window.addEventListener('scroll', toggleHeaderOnScroll);


new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Responsive breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});

