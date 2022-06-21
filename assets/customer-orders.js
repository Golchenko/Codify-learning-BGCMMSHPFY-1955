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

  const requestBody = () => {
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

  fetch(graphqlUrl, requestBody())
    .then((res) => res.json())
    .then((response) => {
      const customerToken =
        response.data.customerAccessTokenCreate.customerAccessToken.accessToken;
      console.log("CUSTOMER_TOKEN: ", customerToken);

      getCustomerOrders(customerToken);
    });
};

const getCustomerOrders = (customerToken) => {
  const getCustomerOrdersQuery = `
        { 
            customer(customerAccessToken: "${customerToken}") {
                id
                orders(first: 15, sortKey: ID, reverse: true) {
                    edges {
                        node {
                            name
                            fulfillmentStatus
                            cancelReason
                        }
                    }
                }
            }
        }
    `;

  const requestBody = () => {
    return {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Content-Type": "application/graphql",
      },
      body: getCustomerOrdersQuery,
    };
  };

  fetch(graphqlUrl, requestBody())
    .then((res) => res.json())
    .then((response) => {
      console.log("CUSTOMER_ORDERS:", response);
      const customerOrders = response.data.customer.orders.edges;

      calculateIncomleteOrders(customerOrders);
    });
};

const calculateIncomleteOrders = (customerOrders) => {
  let incomlitedOrdersCount = 0;
  console.log(customerOrders);

  customerOrders.map((order) => {
    let isFulfillment = order.node.fulfillmentStatus;
    let isCanceled = order.node.cancelReason;
    isFulfillment == "FULFILLED" || isCanceled ? null : incomlitedOrdersCount++;
    console.log("INCOMPLETED_ORDERS_COUNT: ", incomlitedOrdersCount);
    
    showIncomleteOrders(incomlitedOrdersCount);
  });
};
