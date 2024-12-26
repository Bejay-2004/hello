// Category Breakdown - Pie Chart
const categoryBreakdownCtx = document.getElementById('categoryBreakdownChart').getContext('2d');
const categoryBreakdownChart = new Chart(categoryBreakdownCtx, {
    type: 'pie',
    data: {
        labels: ['Academic', 'Events', 'Campus Facilities', 'Other'],
        datasets: [{
            data: [45, 25, 20, 10], // Sample data - replace with actual data
            backgroundColor: ['#007bff', '#ffc107', '#28a745', '#6c757d']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Status Overview - Bar Chart
const statusOverviewCtx = document.getElementById('statusOverviewChart').getContext('2d');
const statusOverviewChart = new Chart(statusOverviewCtx, {
    type: 'bar',
    data: {
        labels: ['Pending', 'Reviewed', 'Implemented'],
        datasets: [{
            data: [30, 40, 30], // Sample data - replace with actual data
            backgroundColor: ['#007bff', '#ffc107', '#28a745']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Suggestions' }
            }
        }
    }
});

// User Engagement - Bar Chart
const userEngagementCtx = document.getElementById('userEngagementChart').getContext('2d');
const userEngagementChart = new Chart(userEngagementCtx, {
    type: 'bar',
    data: {
        labels: ['Likes', 'Comments'], // Engagement metrics
        datasets: [{
            data: [8, 15], // Sample averages - replace with actual data
            backgroundColor: ['#007bff', '#28a745']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Average Count per Suggestion' }
            }
        }
    }
});

// Submission Trends - Line Chart
const submissionTrendsCtx = document.getElementById('submissionTrendsChart').getContext('2d');
const submissionTrendsChart = new Chart(submissionTrendsCtx, {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Sample weekly data - adjust as needed
        datasets: [{
            label: 'Submissions',
            data: [5, 10, 8, 15], // Sample data - replace with actual data
            borderColor: '#007bff',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Submissions' }
            }
        },
        plugins: {
            legend: { position: 'top' }
        }
    }
});
