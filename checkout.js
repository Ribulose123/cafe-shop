document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total");
    const paymentOptionsContainer = document.getElementById("payment-options");
    const cardForm = document.getElementById("card-form");
    const submitCardPaymentButton = document.getElementById("submit-card-payment");
    const returnArrow = document.getElementById("return-arrow");

    function renderCart() {
        cartItemsContainer.innerHTML = ""; // Clear the container
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>No items in the cart</p>";
        } else {
            cartItems.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");

                const itemImage = document.createElement("img");
                itemImage.src = item.image;
                itemImage.alt = item.productName;
                itemImage.classList.add("cart-item-image");

                const itemDetails = document.createElement("div");
                itemDetails.classList.add("item-details");
                itemDetails.innerText = `${item.productName} - $${item.price}`;

                const quantityContainer = document.createElement("div");
                quantityContainer.classList.add("quantity-container");

                const minusButton = document.createElement("button");
                minusButton.innerText = "-";
                minusButton.addEventListener("click", () => updateQuantity(index, -1));

                const quantityText = document.createElement("span");
                quantityText.classList.add("quantity");
                quantityText.innerText = item.quantity || 1;

                const plusButton = document.createElement("button");
                plusButton.innerText = "+";
                plusButton.addEventListener("click", () => updateQuantity(index, 1));

                const deleteButton = document.createElement("button");
                deleteButton.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
                deleteButton.addEventListener("click", () => removeItem(index));

                quantityContainer.appendChild(minusButton);
                quantityContainer.appendChild(quantityText);
                quantityContainer.appendChild(plusButton);
                itemElement.appendChild(itemImage);
                itemElement.appendChild(itemDetails);
                itemElement.appendChild(quantityContainer);
                itemElement.appendChild(deleteButton);

                cartItemsContainer.appendChild(itemElement);
            });
            calculateTotal();
        }
    }

    function updateQuantity(index, delta) {
        if (cartItems[index].quantity == null) {
            cartItems[index].quantity = 1;
        }
        cartItems[index].quantity += delta;
        if (cartItems[index].quantity <= 0) {
            cartItems.splice(index, 1); // Remove item if quantity is 0 or less
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
        renderCart();
    }

    function removeItem(index) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        renderCart();
    }

    function calculateTotal() {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * (item.quantity || 1);
        });
        totalContainer.innerText = `Total: $${total.toFixed(2)}`;
        paymentOptionsContainer.innerHTML = `
            <h2>Select Payment Method</h2>
            <p>Total: $${total.toFixed(2)}</p>
            <label>
                <input type="radio" name="payment" value="cash" /> Cash on Delivery
            </label>
            <label>
                <input type="radio" name="payment" value="card" /> Pay with Card
            </label>
        `;
    }

    function displayThankYouMessage() {
        localStorage.removeItem("cart"); // Clear the cart from localStorage
        const body = document.querySelector("body");
        body.innerHTML = "<h1>Thank You for Your Order!</h1><p>Your payment was successful.</p>";
    }

    function handlePaymentSelection(event) {
        const selectedPayment = event.target.value;
        if (selectedPayment === "cash") {
            displayThankYouMessage();
        } else if (selectedPayment === "card") {
            paymentOptionsContainer.classList.add("hide");
            cardForm.classList.remove("hide");
            returnArrow.classList.remove("hide");
        }
    }

    function handleReturn() {
        cardForm.classList.add("hide");
        returnArrow.classList.add("hide");
        paymentOptionsContainer.classList.remove("hide");
    }

    function handleCardPaymentSubmission(event) {
        event.preventDefault();
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;
        if (cardNumber && expiryDate && cvv) {
            displayThankYouMessage();
        } else {
            alert("Please fill in all card details.");
        }
    }

    paymentOptionsContainer.addEventListener("change", handlePaymentSelection);
    returnArrow.addEventListener("click", handleReturn);
    submitCardPaymentButton.addEventListener("click", handleCardPaymentSubmission);

    renderCart(); // Initial render of the cart items
});
