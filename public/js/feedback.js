document.addEventListener("DOMContentLoaded", function() {
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.submit-btn');
    const notification = document.querySelector('.notification');
    const wordLimitMessage = document.querySelector('.word-limit');
    const feedbackOptions = document.querySelectorAll('input[name="feedback"]');

    // Function to handle enabling/disabling the comment input and button visibility
    function handleFeedbackSelection() {
        const customFeedbackSelected = document.querySelector('input[name="feedback"][value="custom"]').checked;
        const anyOptionSelected = Array.from(feedbackOptions).some(option => option.checked);

        // Show submit button if any option is selected
        submitButton.style.display = anyOptionSelected ? "block" : "none";

        // Show comment input and word limit message only if "custom" option is selected
        if (customFeedbackSelected) {
            commentInput.disabled = false;
            commentInput.style.display = "block";
            wordLimitMessage.style.display = "block";
        } else {
            commentInput.disabled = true;
            commentInput.style.display = "none";
            wordLimitMessage.style.display = "none";
            commentInput.value = ''; // Clear the input if not enabled
        }

        toggleSubmitButton(); // Check if submit button should be enabled
    }

    // Function to toggle the submit button's enabled state
    function toggleSubmitButton() {
        const commentNotEmpty = commentInput.value.trim() !== "";
        submitButton.disabled = !(commentInput.disabled || commentNotEmpty);
    }

    // Attach change event listeners to radio buttons
    feedbackOptions.forEach(option => {
        option.addEventListener('change', handleFeedbackSelection);
    });

    // Add an event listener to the comment input to toggle the submit button
    commentInput.addEventListener('input', toggleSubmitButton);

    submitButton.addEventListener('click', function() {
        // Only check word limit if the comment input is visible
        if (commentInput.style.display === "block") {
            // Split the comment input into words and filter out any empty strings
            const words = commentInput.value.trim().split(/\s+/).filter(word => word.length > 0);

            if (words.length > 100) {
                alert('You can only enter a maximum of 100 words.');
                return; // Stop submission if the word limit is exceeded
            }
        }

        // Set notification text and styles
        notification.textContent = "Your response is now submitted.";
        notification.style.display = "block"; // Make the notification visible
        notification.style.color = "white"; // Set text color to white
        notification.style.padding = "10px"; // Add padding
        notification.style.borderRadius = "5px"; // Add rounded corners
        notification.style.marginTop = "10px"; // Add top margin
        commentInput.value = ''; // Clear the input field after submission
        toggleSubmitButton(); // Update the submit button state
    });

    // Initial state of the submit button
    handleFeedbackSelection(); // Ensure initial visibility and state
});
