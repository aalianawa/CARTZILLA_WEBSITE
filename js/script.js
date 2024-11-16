document.querySelectorAll('.btn-primary, .btn-outline-danger').forEach(button => {
    button.addEventListener('click', function () {
      const input = this.parentNode.querySelector('input[type="number"]');
      let value = parseInt(input.value);
  
      if (this.classList.contains('btn-outline-danger')) {

        input.value = value + 1;
      } else if (this.classList.contains('btn-primary') && value > 0) {
        
        input.value = value - 1;
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const emailTooltip = emailInput.nextElementSibling;
    const passwordTooltip = passwordInput.nextElementSibling;
  
    // Event handler for email input
    emailInput.addEventListener("input", () => {
        if (emailInput.value.trim() === "") {
            emailTooltip.textContent = "Enter a valid email address!";
            emailTooltip.style.color = "red";
            emailInput.classList.add("is-invalid");
        } else {
            emailTooltip.textContent = "Looks good!";
            emailTooltip.style.color = "green";
            emailInput.classList.remove("is-invalid");
            emailInput.classList.add("is-valid");
        }
    });
  
    // Event handler for password input
    passwordInput.addEventListener("input", () => {
        if (passwordInput.value.trim() === "") {
            passwordTooltip.textContent = "Password does not meet the required criteria!";
            passwordTooltip.style.color = "red";
            passwordInput.classList.add("is-invalid");
        } else {
            passwordTooltip.textContent = "Looks good!";
            passwordTooltip.style.color = "green";
            passwordInput.classList.remove("is-invalid");
            passwordInput.classList.add("is-valid");
        }
    });
  
    // Sign-in button click handler with API validation
    document.getElementById("signInButton").addEventListener("click", (e) => {
        e.preventDefault();
  
        const userEmail = emailInput.value.trim();
        const userPassword = passwordInput.value.trim();
  
        let isValid = true;
  
        if (userEmail === "") {
            emailTooltip.textContent = "Enter a valid email address!";
            emailTooltip.style.color = "red";
            emailInput.classList.add("is-invalid");
            isValid = false;
        }
  
        if (userPassword === "") {
            passwordTooltip.textContent = "Password does not meet the required criteria!";
            passwordTooltip.style.color = "red";
            passwordInput.classList.add("is-invalid");
            isValid = false;
        }
  
        if (isValid) {
            // Fetch user data from API
            fetch("https://fakestoreapi.com/users")
                .then(response => response.json())
                .then(data => {
                    const usersArray = data;
  
                    // Find a match for the email and password
                    const userMatch = usersArray.find(user =>
                        user.email === userEmail && user.password === userPassword
                    );
  
                    if (userMatch) {
                        // Redirect to home page if match is found
                        window.location.href = "/index.html";
                    } else {
                        // Show validation error if no match is found
                        alert("Invalid email or password. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                    alert("An error occurred while processing your request. Please try again.");
                });
        }
    });
  });
  
  





  let cart = [];

function addToCart(productId) {
  const productCard = document.getElementById(productId);
  const productName = productCard.querySelector('.product-name').innerText;
  const pricePerUnit = parseFloat(productCard.querySelector('.product-price').dataset.price);
  const quantity = 1; // Default quantity for Add to Cart
  const totalPrice = pricePerUnit * quantity;

  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
    existingProduct.totalPrice = existingProduct.quantity * pricePerUnit;
  } else {
    cart.push({
      id: productId,
      name: productName,
      pricePerUnit: pricePerUnit,
      quantity: quantity,
      totalPrice: totalPrice
    });
  }

  updateCartUI();
}

function updateCartUI() {
  const cartContainer = document.querySelector('#shoppingCart .offcanvas-body');
  let cartHTML = '';

  cart.forEach(item => {
    cartHTML += `
      <div class="d-flex align-items-center mb-3">
        <a href="#" class="me-3">
          <img src="assets/img/shop/grocery/thumbs/${item.id}.png" alt="Thumbnail" width="80">
        </a>
        <div class="w-100">
          <h5 class="fs-6 mb-1">${item.name}</h5>
          <div class="text-muted mb-2">$${item.pricePerUnit.toFixed(2)}</div>
          <div class="d-flex align-items-center justify-content-between">
            <div class="input-group" style="width: 100px;">
              <button class="btn btn-outline-secondary btn-sm" type="button" onclick="updateQuantityInCart('${item.id}', 'decrease')">-</button>
              <input type="text" class="form-control form-control-sm text-center" value="${item.quantity}" readonly>
              <button class="btn btn-outline-secondary btn-sm" type="button" onclick="updateQuantityInCart('${item.id}', 'increase')">+</button>
            </div>
            <button type="button" class="btn-close" aria-label="Remove" onclick="removeFromCart('${item.id}')"></button>
          </div>
        </div>
      </div>`;
  });

  if (cart.length === 0) {
    cartHTML = '<p>Your cart is empty.</p>';
  }

  cartContainer.innerHTML = cartHTML;

  updateCartBadge();
}

function updateCartBadge() {
  const cartBadge = document.querySelector('.badge.bg-danger');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.innerText = totalItems;
}

function updateQuantityInCart(productId, action) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    if (action === 'increase') {
      product.quantity += 1;
    } else if (action === 'decrease' && product.quantity > 1) {
      product.quantity -= 1;
    }
    product.totalPrice = product.quantity * product.pricePerUnit;
    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}
