document.addEventListener("DOMContentLoaded", () => {
    let products = {
        data: [
            { productName: "chicken wrapper", category: "dessert", price: "30", image: "image/chicken-wrap-doner-with-tomato_140725-10509.jpg", ratings: [] },
            { productName: "Vanila latte", category: "coffee", price: "49", image: "image/latte-coffee-cup_1203-3395.jpg", ratings: [] },
            { productName: "Cappuccion with mashmelow", category: "coffee", price: "99", image: "image/images (12).jpeg", ratings: [] },
            { productName: "Chocalate tea", category: "coffee", price: "29", image: "image/coffee-preparation-concept-still-life_23-2150354610.jpg", ratings: [] },
            { productName: "Chicken sandwich", category: "dessert", price: "129", image: "image/delicious-sandwich_144627-15079.jpg", ratings: [] },
            { productName: "mango smoothie", category: "smoothies", price: "89", image: "image/mango smoothies.webp", ratings: [] },
            { productName: "chocolate gaze donut", category: "dessert", price: "189", image: "image/glazed-chocolate-pink-donuts.jpg", ratings: [] },
            { productName: "Apple peanut smoothie", category: "smoothies", price: "80", image: "image/Apple-Peanut-Butter-Smoothie-1801.jpg", ratings: [] },
            { productName: "Cucumber lemonade", category: "Drinks", price: "40", image: "image/cucumber lemonade.jpg", ratings: [] },
            { productName: "Cappuccion with wipcream", category: "coffee", price: "49", image: "image/rustic-wood-table-holds-frothy-coffee-drinks-generated-by-ai_188544-22883.jpg", ratings: [] },
            { productName: "Cookie", category: "dessert", price: "49", image: "image/cookie.jpeg", ratings: [] },
            { productName: "lemonade", category: "Drinks", price: "40", image: "image/ice lemonade.jpg", ratings: [] },
            { productName: "Raspberries jam donut", category: "dessert", price: "49", image: "image/delicious-donut-raspberries.jpg", ratings: [] },
            { productName: "powered donut", category: "dessert", price: "49", image: "image/snake-doughnuts-with-powdered-sugar.jpg", ratings: [] }
        ]
    };

    let storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};

    function renderProducts() {
        const productsContainer = document.getElementById("products");
        productsContainer.innerHTML = ""; // Clear existing products

        for (let product of products.data) {
            // Retrieve stored ratings if they exist
            if (storedRatings[product.productName]) {
                product.ratings = storedRatings[product.productName];
            }

            let card = document.createElement("div");
            card.classList.add("product-card", product.category.toLowerCase());

            // Image container
            let imgContainer = document.createElement("div");
            imgContainer.classList.add("image-container");

            let image = document.createElement("img");
            image.setAttribute("src", product.image);
            imgContainer.appendChild(image);
            card.appendChild(imgContainer);

            let container = document.createElement("div");
            container.classList.add("container");

            let name = document.createElement("h5");
            name.classList.add("product-name");
            name.innerText = product.productName.toUpperCase();
            container.appendChild(name);

            // Rating stars
            let ratingContainer = document.createElement("div");
            ratingContainer.classList.add("rating-container");
            let averageRating = calculateAverageRating(product.ratings);
            for (let j = 0; j < 5; j++) {
                let star = document.createElement("ion-icon");
                star.setAttribute("name", j < averageRating ? "star" : "star-outline");
                star.classList.add("rating-star");
                star.style.color = j < averageRating ? "gold" : "grey";
                star.dataset.index = j + 1;
                ratingContainer.appendChild(star);
            }
            container.appendChild(ratingContainer);

            // Price
            let price = document.createElement("h6");
            price.innerText = "$" + product.price;
            container.appendChild(price);

            card.appendChild(container);

            ratingContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("rating-star")) {
                    let ratingIndex = parseInt(event.target.dataset.index);
                    product.ratings.push(ratingIndex); // Add new rating
                    storedRatings[product.productName] = product.ratings;
                    localStorage.setItem("ratings", JSON.stringify(storedRatings));
                    updateAverageRating(ratingContainer, product.ratings);
                }
            });

            productsContainer.appendChild(card);
        }
    }

    function calculateAverageRating(ratings) {
        if (ratings.length === 0) return 0;
        let sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return Math.round(sum / ratings.length);
    }

    function updateAverageRating(ratingContainer, ratings) {
        let averageRating = calculateAverageRating(ratings);
        let stars = ratingContainer.querySelectorAll(".rating-star");
        stars.forEach((star, index) => {
            star.setAttribute("name", index < averageRating ? "star" : "star-outline");
            star.style.color = index < averageRating ? "gold" : "grey";
        });
    }

    renderProducts();
});
