const storefrontAccessToken = "28fec38c8f41d274be22669aa6d918db";
const graphqlUrl = "https://golchenko.myshopify.com/api/2022-04/graphql.json";

document.addEventListener("DOMContentLoaded", () => {
  const loginEmail = document.querySelector("#CustomerEmail");
  const loginPassword = document.querySelector("#CustomerPassword");
  const customerButton = document.querySelector("#customerBtn");

  customerButton.addEventListener("click", (event) => {
    event.preventDefault();

    let customerEmail = loginEmail.value;
    let customerPassword = loginPassword.value;
    getCustomerAccessToken(customerEmail, customerPassword);
  });
});

const getCustomerAccessToken = (customerEmail, customerPassword) => {
  //   let customerData = `{
  //         "email": "${customerEmail}",
  //         "password": "${customerPassword}"
  //       }`;

  // const createTokenQuery = `
  //       mutation createCustomerAccessToken {
  //           customerAccessTokenCreate(input: {
  //               "email": "${customerEmail}",
  //               "password": "${customerPassword}"
  //             })
  //           customerAccessToken {
  //               accessToken
  //               expiresAt
  //           }
  //       }
  //   `;
  const createTokenQuery = `
    mutation {
        customerAccessTokenCreate(
            input: {
                email: "${customerEmail}",
                password: "${customerPassword}"
            }
        ) 
        {
            customerAccessToken {
                accessToken,
                expiresAt 
            }, 
            customerUserErrors {
                code 
            } 
        } 
    }
  `;

  const graphqBody = () => {
    return {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Content-Type": "application/graphql",
      },
      body: createTokenQuery,
    };
  };

  fetch(graphqlUrl, graphqBody())
    .then((res) => res.json())
    .then((response) => {
        const customerToken = response.data.customerAccessTokenCreate.customerAccessToken.accessToken;
      console.log("token", customerToken);
    });


};
