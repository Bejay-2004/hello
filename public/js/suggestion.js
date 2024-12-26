// Sample data for demonstration
const suggestions = [
    { id: 1, title: 'Improve Library Resources', category: 'Academic', status: 'Pending', dateSubmitted: '2024-11-01', userName: 'Alice' },
    { id: 2, title: 'More Campus Events', category: 'Events', status: 'Reviewed', dateSubmitted: '2024-11-02', userName: 'Bob' },
    { id: 3, title: 'Upgrade Gym Equipment', category: 'Campus Facilities', status: 'Implemented', dateSubmitted: '2024-11-03', userName: 'Charlie' },
];

// Function to load posts from the server and populate the table
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();

        const tableBody = document.getElementById("suggestionTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ''; // Clear existing rows

        // Loop through the posts and add rows to the table
        posts.forEach(post => {
            const row = document.createElement('tr');

            // Add the data from the database
            row.innerHTML = `
                <td>${post.user_id}</td>
                <td>${post.category}</td>
                <td>${post.Content}</td> <!-- Added Content -->
                <td>Pending</td> <!-- Default status, can be updated -->
                <td>
                    <button onclick="viewPost(${post.user_id})">Remain</button>
                    <button onclick="editPost(${post.user_id})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Call loadPosts when the page loads
document.addEventListener('DOMContentLoaded', loadPosts);

// Dummy functions for "View" and "Edit" actions
function viewPost(userID) {
    alert(`Viewing post by User ID: ${userID}`);
}

function editPost(userID) {
    alert(`Editing post by User ID: ${userID}`);
}

// Function to apply filters
function applyFilters() {
    // Get filter values
    const searchValue = document.getElementById("search").value.toLowerCase();
    const categoryValue = document.getElementById("categoryFilter").value;
    const statusValue = document.getElementById("statusFilter").value;
    const dateValue = document.getElementById("dateFilter").value;

    // Get all rows from the suggestions table
    const table = document.getElementById("suggestionTable");
    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    // Loop through all rows in the table and apply filters
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");

        // Extract relevant cell data
        const content = cells[2]?.textContent.toLowerCase() || ""; // Content is now at index 2
        const category = cells[1]?.textContent || "";
        const status = cells[3]?.textContent || "";
        const date = cells[4]?.textContent || "";

        // Check if each row matches the filters
        const matchesSearch = content.includes(searchValue);
        const matchesCategory = !categoryValue || category === categoryValue;
        const matchesStatus = !statusValue || status === statusValue;
        const matchesDate = !dateValue || date === dateValue;

        // Show row if it matches all filters, hide otherwise
        if (matchesSearch && matchesCategory && matchesStatus && matchesDate) {
            rows[i].style.display = "";  // Show row
        } else {
            rows[i].style.display = "none";  // Hide row
        }
    }
}

// Function to load filtered suggestions (if any filtering is done)
function loadFilteredSuggestions(filteredSuggestions) {
    const tableBody = document.getElementById('suggestionTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    filteredSuggestions.forEach(suggestion => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${suggestion.userID}</td>
            <td>${suggestion.category}</td>
            <td>${suggestion.Content}</td> <!-- Added Content -->
            <td>${suggestion.status}</td>
            <td>
       <button onclick="viewSuggestion(${suggestion.userID})">Remain</button> <!-- Changed text from 'View' to 'Remain' -->
        <button onclick="editSuggestion(${suggestion.userID})">Delete</button> <!-- Changed text from 'Edit' to 'Delete' -->
            </td>
        `;
    });
}

// Call loadSuggestions when the page loads
document.addEventListener("DOMContentLoaded", loadSuggestions);
