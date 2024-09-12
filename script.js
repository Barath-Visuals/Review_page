document.addEventListener("DOMContentLoaded", function() {
    const reviewForm = document.getElementById("review-form");
    const reviewInput = document.getElementById("review-input");
    const reviewsContainer = document.getElementById("reviews-container");

    // Function to render reviews
    function renderReviews(reviews) {
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
            const reviewBox = document.createElement("div");
            reviewBox.className = "review-box";
            reviewBox.innerHTML = `
                <p>${review.reviewText}</p>
                <button class="edit-btn" data-id="${review._id}">Edit</button>
            `;
            reviewsContainer.appendChild(reviewBox);
        });
    }

    // Fetch existing reviews from backend
    function fetchReviews() {
        fetch('http://127.0.0.1:5000/reviews') // Correct port and endpoint
            .then(response => response.json())
            .then(data => renderReviews(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }

    fetchReviews(); // Load reviews initially

    // Handle review form submission
    reviewForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const newReview = reviewInput.value;

        fetch('http://127.0.0.1:5000/reviews', { // Make sure to use the correct backend URL and port
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'User', reviewText: newReview }) // Send the correct fields
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to post review');
            }
            return response.json();  // Ensure the response is parsed as JSON
        })
        .then(data => {
            console.log("Review posted successfully:", data);
            fetchReviews(); // Fetch and re-render reviews after posting
            reviewInput.value = '';  // Clear the input field
        })
        .catch(error => {
            console.error("Error posting review:", error);
        });
    });

    // Handle review edit
    reviewsContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("edit-btn")) {
            const reviewId = event.target.getAttribute("data-id");
            const currentText = event.target.previousElementSibling.innerText;
            const newText = prompt("Edit your review:", currentText);
            
            if (newText !== null) {
                fetch(`http://127.0.0.1:5000/reviews/${reviewId}`, { // Ensure the correct URL
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewText: newText }) // Send updated text
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update review');
                    }
                    return response.json();  // Ensure the response is parsed as JSON
                })
                .then(data => {
                    console.log("Review updated successfully:", data);
                    fetchReviews(); // Refresh reviews after edit
                })
                .catch(error => console.error('Error updating review:', error));
            }
        }
    });
});
