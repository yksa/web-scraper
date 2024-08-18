import axios from "axios";

// Define the endpoint and headers
const url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

// Define the payload (request data)
const data = {
  asset: "USDT",
  fiat: "THB",
  tradeType: "BUY", // or 'SELL' depending on what you're looking for
  page: 1,
  rows: 5,
  payTypes: [], // Filter by specific payment methods if needed
};

async function getP2PPrice() {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const offers = response.data.data;

    if (offers.length === 0) {
      console.log("No offers available for the specified fiat currency.");
      return;
    }

    offers.forEach((offer, index) => {
      console.log(`Offer ${index + 1}:`);
      console.log(`Price: ${offer.adv.price}`);
      console.log(`Available Amount: ${offer.adv.surplusAmount}`);
      console.log(`Seller Nickname: ${offer.advertiser.nickName}`);

      const paymentMethods = offer.adv.tradeMethods.map(
        (method) => method.tradeMethodName
      );
      console.log(`Payment Methods: ${paymentMethods.join(", ")}`);
      console.log("---");
    });
  } catch (error) {
    console.error("Error fetching P2P price:", error.message);
  }
}

// Call the function to get P2P prices
getP2PPrice();
