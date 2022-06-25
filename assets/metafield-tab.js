let keys = metafieldKeys.split(",");

document.addEventListener("DOMContentLoaded", () => {
  createQuery();
});

const createQuery = () => {
  let queryBody = "";

  keys.forEach((key) => {
    let element = ` ${key}: metafield(namespace: "${metafieldNamespace}", key: "${key}") {
        key
        value
      }`;
    queryBody += element;
    return queryBody;
  });

  const metafieldQuery = `
  {
      product(handle: "${productHandle}") {
        ${queryBody}
      }
    }
  `;
  getProductMetafields(metafieldQuery);
};

const getProductMetafields = (metafieldQuery) => {
  const storefrontAccessToken = "28fec38c8f41d274be22669aa6d918db";
  const graphqlUrl = "https://golchenko.myshopify.com/api/2022-04/graphql.json";

  const requestBody = () => {
    return {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Content-Type": "application/graphql",
      },
      body: metafieldQuery,
    };
  };

  fetch(graphqlUrl, requestBody())
    .then((res) => res.json())
    .then((response) => {
      const metafields = response.data.product;

      showProductSpecs(metafields);
    });
};

const showProductSpecs = (metafields) => {
  let str = JSON.stringify(metafields);
  keys.forEach((key) => {
    str = str.replace(`"${key}":`, "");
  });
  let specs = JSON.parse(str.replace(str[0], "[").replace(/.$/, "]"));
  let template = "";
  specs.map((item) => {
    let element = `<p>${item.key} : ${item.value}</p>`;
    template += element;
  });

  const cartAddSubmit = document.querySelector(".metafields-tab__summary");

  cartAddSubmit.innerHTML = template;
};
