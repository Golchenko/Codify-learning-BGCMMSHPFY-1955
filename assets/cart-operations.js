document.addEventListener("DOMContentLoaded", () => {
  const cartAddSubmit = document.querySelector(".cart-add__submit"),
    cartAddProduct = document.querySelector(".cart-add__product"),
    cartAddQuantity = document.querySelector(".cart-add__quantity"),
    cartRemoveSubmit = document.querySelector(".cart-remove__submit"),
    cartRemoveProduct = document.querySelector(".cart-remove__product"),
    cartUpdateProduct = document.querySelector(".cart-update__product"),
    cartUpdateQuantity = document.querySelector(".cart-update__quantity"),
    cartUpdateSubmit = document.querySelector(".cart-update__submit");

  cartCheck();

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

  cartUpdateSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    if (cartUpdateProduct.value && cartUpdateQuantity.value) {
      let operation = "cart/update.js";
      let productData = `{"updates":{"${cartRemoveProduct.value}":${cartUpdateQuantity.value}}}`;
      cartOperations(productData, operation);
    } else {
      alert("Check the input data!");
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
      if (operation == "cart/add.js") {
        if (response.ok == true) {
          alert("Successfully added :)");
        } else {
          getProductId(productData, operation);
        }

        if (operation == "cart/update.js") {
          response.ok == true
            ? alert("Cart Successfully updated :)")
            : alert("Somethings goes wrong :(");
        }
      }

      cartCheck();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error");
    });
}

async function cartCheck() {
  let carteditForm = document.querySelector(".cart-edit__form");
  const checkCart = await fetch(window.Shopify.routes.root + `cart.js`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log(checkCart);
  checkCart.item_count == 0
    ? carteditForm.setAttribute("disabled", "disabled")
    : carteditForm.removeAttribute("disabled");
}

async function getProductId(productData, operation) {
  let productHandle = JSON.parse(productData).items[0].id;
  let quantity = JSON.parse(productData).items[0].quantity;

  const productJson = await fetch(
    window.Shopify.routes.root + `products/${productHandle}.js`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error, Invalid data entered :(");
    });
  console.log("productJson", productJson);

  let productId = productJson.variants[0].id;

  let formData = {
    items: [
      {
        id: productId,
        quantity: quantity,
      },
    ],
  };
  let modifiedProductData = JSON.stringify(formData);

  cartOperations(modifiedProductData, operation);
}
