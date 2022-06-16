document.addEventListener("DOMContentLoaded", () => {
  const cartAddSubmit = document.querySelector(".cart-add__submit"),
    cartAddProduct = document.querySelector(".cart-add__product"),
    cartAddQuantity = document.querySelector(".cart-add__quantity"),
    cartRemoveSubmit = document.querySelector(".cart-remove__submit"),
    cartRemoveProduct = document.querySelector(".cart-remove__product");

  cartAddSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    if (cartAddProduct.value && cartAddQuantity.value) {
      let productData = {
        items: [
          {
            id: cartAddProduct.value,
            quantity: cartAddQuantity.value,
          },
        ],
      };
      addToCart(productData, operation);
    } else {
      alert("You did not specify a product!");
    }
  });

  cartRemoveSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    if (cartRemoveProduct.value) {
      let productData = `{"updates":{"${cartRemoveProduct.value}":0}}`;
    //   console.log(`{"updates":{"${cartRemoveProduct.value}":0}}`);
      removeFromCart(productData);
    } else {
      alert("You did not specify a product!");
    }
  });
});

function addToCart(productData) {
  fetch(window.Shopify.routes.root + `cart/add.js`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  })
    .then((response) => {
      console.log(response);
      response.ok == true
        ? alert("Successfully added :)")
        : alert("Somethings goes wrong :(");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error");
    });
}

function removeFromCart(productData) {
    fetch(window.Shopify.routes.root + `cart/update.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: productData,
    })
      .then((response) => {
        console.log(response);
        response.ok == true
          ? alert("Successfully removed :)")
          : alert("Somethings goes wrong :(");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error");
      });
  }