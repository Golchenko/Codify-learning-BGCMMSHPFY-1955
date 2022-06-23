document.addEventListener("DOMContentLoaded", () => {
  const customerRegister = document.querySelector("#customerRegister"),
    headerMessage = document.querySelector("#customerSuccessMessage");

  customerRegister ? writeCookie(customerRegister) : null;

  showWelcomeMessage(headerMessage);
});

const writeCookie = (customerRegister) => {
  customerRegister.addEventListener("click", (event) => {
    // event.preventDefault();
    document.cookie = `new-customer=true; path=/`;
  });
};

const showWelcomeMessage = (headerMessage) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("new-customer="))
    ?.split("=")[1];
  console.log("cookie:", cookieValue);
  if (cookieValue == "true") {
    headerMessage.style.display = "block";
    console.log("SHOW message");
    deleteCookie();
  }
};

const deleteCookie = () => {
  document.cookie = "new-customer=true; max-age=0";
  console.log(document.cookie);
}

//   (function() {
//     const REDIRECT_PATH = '/pages/customer-register-success';

//     const selector = '#create_customer, form[action$="/account"][method="post"]',
//         $form = document.querySelectorAll(selector)[0];

//     if ($form) {
//       $redirect = document.createElement('input');
//       $redirect.setAttribute('name', 'return_to');
//       $redirect.setAttribute('type', 'hidden');
//       $redirect.value = REDIRECT_PATH;
//       $form.appendChild($redirect);
//     }
//   })();
