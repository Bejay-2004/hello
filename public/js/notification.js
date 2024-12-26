
document.addEventListener('DOMContentLoaded', function() {
    const notificationMessage = sessionStorage.getItem('notificationMessage');
    const notificationDiv = document.getElementById('notificationMessage');
    
    if (notificationMessage) {
        notificationDiv.textContent = notificationMessage;
        sessionStorage.removeItem('notificationMessage'); // Clear the notification after displaying it
    } else {
        notificationDiv.textContent = "No new notifications.";
    }
});
