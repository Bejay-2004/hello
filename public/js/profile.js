document.addEventListener("DOMContentLoaded", function() {
    // Fetch user data after the page loads
    fetch('/get-user', {
        method: 'GET',
        credentials: 'include'  // Include cookies for session if necessary
    })
    .then(response => response.json())
    .then(data => {
        if (data.userId && data.username) {
            // Populate user data
            document.getElementById('profile-username').textContent = data.username;
            document.getElementById('profile-id').textContent = data.userId;

            // Now fetch the posts for the user
            fetch('/get-posts')
                .then(response => response.json())
                .then(postsData => {
                    const postsList = document.getElementById('posts-list');
                    postsList.innerHTML = '';  // Clear previous posts if any

                    const posts = postsData.posts || [];

                    posts.forEach(post => {
                        // Create a new post item
                        const postItem = document.createElement('div');
                        postItem.classList.add('post-item');

                        // Create the post header (category)
                        const postHeader = document.createElement('div');
                        postHeader.classList.add('post-header');
                        postHeader.innerHTML = `<span class="hashtag">${post.category}</span>`;

                        // Create the post content
                        const postContent = document.createElement('p');
                        postContent.classList.add('post-content');
                        postContent.textContent = post.content;

                        // Append the header and content to the post item
                        postItem.appendChild(postHeader);
                        postItem.appendChild(postContent);

                        // Append the post item to the posts list
                        postsList.appendChild(postItem);
                    });
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    // Handle error, possibly show an alert or message to the user
                });
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle error, show default values or error message
        document.getElementById('profile-username').textContent = 'Error';
        document.getElementById('profile-id').textContent = 'Error';
    });
});
