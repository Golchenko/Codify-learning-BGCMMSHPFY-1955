document.addEventListener("DOMContentLoaded", () => {
  const cartAddSubmit = document.querySelector(".cart-add__submit"),
    cartAddProduct = document.querySelector(".cart-add__product"),
    cartAddQuantity = document.querySelector(".cart-add__quantity"),
    cartRemoveSubmit = document.querySelector(".cart-remove__submit"),
    cartRemoveProduct = document.querySelector(".cart-remove__product");

  cartAddSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    if (cartAddProduct.value && cartAddQuantity.value) {
      let operation = "cart/add.js";
      let formData = {
        items: [
          {
            id: cartAddProduct.value,
            quantity: cartAddQuantity.value,
          },
        ],
      };
      let productData = JSON.stringify(formData);
      cartOperations(productData, operation);
    } else {
      alert("You did not specify a product!");
    }
  });

  cartRemoveSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    if (cartRemoveProduct.value) {
      let operation = "cart/update.js";
      let productData = `{"updates":{"${cartRemoveProduct.value}":0}}`;
      cartOperations(productData, operation);
    } else {
      alert("You did not specify a product!");
    }
  });
});

function cartOperations(productData, operation) {
  fetch(window.Shopify.routes.root + `${operation}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: productData,
  })
    .then((response) => {
      console.log(response);
      operation == "cart/add.js"
        ? response.ok == true
          ? alert("Successfully added :)")
          : alert("Somethings goes wrong :(")
        : response.ok == true
        ? alert("Successfully removed :)")
        : alert("Somethings goes wrong :(");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error");
    });
}

