document.addEventListener("DOMContentLoaded", function() {
    const categorySelect = document.querySelector('.category-select');
    const customCategoryInput = document.createElement('input');
    customCategoryInput.type = 'text';
    customCategoryInput.placeholder = 'Please specify your category...';
    customCategoryInput.className = 'custom-category-input';
    customCategoryInput.style.display = 'none';

    const postTextarea = document.querySelector('.post-textarea');
    const postButton = document.querySelector('.post-btn');
    const notification = document.querySelector('.notification');

    const dropdownContainer = categorySelect.parentElement;
    dropdownContainer.appendChild(customCategoryInput);

    postButton.disabled = true;

    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    function checkButtonState() {
        const selectedCategory = categorySelect.value === "other" ? customCategoryInput.value.trim() : categorySelect.value;
        const commentText = postTextarea.value;
        const wordCount = countWords(commentText);

        if (selectedCategory && commentText && wordCount <= 1000) {
            postButton.disabled = false;
            notification.style.display = "none";
        } else {
            postButton.disabled = true;
            if (!commentText || !selectedCategory) {
                notification.textContent = "Please select a category and add a comment before posting.";
                notification.style.display = "block";
            } else {
                notification.style.display = "none";
            }
        }
    }

    categorySelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customCategoryInput.style.display = 'block';
        } else {
            customCategoryInput.style.display = 'none';
            customCategoryInput.value = '';
        }
        checkButtonState();
    });

    postTextarea.addEventListener('input', checkButtonState);
    customCategoryInput.addEventListener('input', checkButtonState);

    postButton.addEventListener('click', async function() {
        const commentText = postTextarea.value;
        const selectedCategory = categorySelect.value === "other" ? customCategoryInput.value.trim() : categorySelect.value;
        const finalCategory = selectedCategory.startsWith('#') ? selectedCategory : '#' + selectedCategory;
        const wordCount = countWords(commentText);
    
        if (!finalCategory || !commentText) {
            notification.textContent = "Please select a category and add a comment before posting.";
            notification.style.display = "block";
            return;
        }
    
        if (wordCount > 1000) {
            alert('You can only enter a maximum of 1000 words.');
            return;
        }
    
        // Show loading animation
        postButton.classList.add('loading');
        postButton.disabled = true;
    
        try {
            const response = await fetch('http://localhost:3000/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: finalCategory,
                    content: commentText,
                }),
                credentials: 'include' // Important for sending cookies
            });
    
            const result = await response.json();
    
            if (result.success) {
                postButton.textContent = 'Posted!';
                // Store notification message in sessionStorage
                sessionStorage.setItem('notificationMessage', 'Post created successfully!');
                window.location.href = 'notification.html'; // Redirect to notification page
            } else {
                notification.textContent = result.message || 'Error creating post';
                notification.style.display = "block";
            }
        } catch (error) {
            console.error('Error creating post:', error);
            notification.textContent = 'Error creating post. Please try again.';
            notification.style.display = "block";
        } finally {
            postButton.classList.remove('loading');
        }
    });    
});
