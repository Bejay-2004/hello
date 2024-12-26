document.addEventListener("DOMContentLoaded", function() {
    const postsContainer = document.querySelector('.posts-container'); // Updated container

    // Function to display notifications
    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#444';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    // Function to load posts from localStorage
    function loadPosts() {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];

        // Reverse the array to display the latest post at the top
        posts = posts.reverse();

        postsContainer.innerHTML = ''; // Clear existing posts

        posts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';

            // Create the post header (category)
            const postHeader = document.createElement('div');
            postHeader.className = 'post-header';
            postHeader.innerHTML = `<span class="hashtag">${post.category}</span>`;

            // Create the post content
            const postContent = document.createElement('p');
            postContent.className = 'post-content';
            postContent.textContent = post.content;

            // Remove the comment section and icons related to likes, comments, and saves
            const postItemContent = document.createElement('div');
            postItemContent.className = 'post-item-content';
            postItemContent.appendChild(postHeader);
            postItemContent.appendChild(postContent);

            postItem.appendChild(postItemContent);
            postsContainer.appendChild(postItem);
        });
    }

    loadPosts(); // Load posts when the page is ready
});
