document.addEventListener("DOMContentLoaded", function () {
    // Fetch all contacts from the belly table
    fetch('/api/get-all-contacts')  // Backend API endpoint that fetches all contacts
        .then(response => response.json())
        .then(data => {
            const users = data.users || [];
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = '';  // Clear any existing rows

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.user_id}</td>
                    <td>${user.username}</td>
                    <td>
                        <button class="edit-btn" onclick="editUser(${user.user_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteUser(${user.user_id})">Delete</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
        });
});

// Edit button functionality
function editUser(user_id) {
    const newName = prompt("Enter new name:");  // Example: Get new name from prompt or form

    if (newName) {
        // Send the updated data to the server to update the user record in the database
        fetch('/update-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,  // Corrected to use user_id
                username: newName,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("User updated successfully!");
                location.reload(); // Reload the page to see the updated data
            } else {
                alert("Failed to update user.");
            }
        })
        .catch(error => {
            console.error("Error updating user:", error);
            alert("An error occurred while updating the user.");
        });
    }
}

// Delete button functionality
function deleteUser(user_id) {
    // Confirm deletion with the user
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    
    if (confirmDelete) {
        // Send the request to delete the user
        fetch('/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id }),  // Corrected to use user_id
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("User deleted successfully!");
                location.reload(); // Reload the page to reflect changes
            } else {
                alert("Failed to delete user.");
            }
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        });
    }
}
