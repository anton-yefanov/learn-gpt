"use client";

import React, { useState } from "react";

import {
  PayPalScriptProvider,
  usePayPalCardFields,
  PayPalCardFieldsProvider,
  PayPalButtons,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
} from "@paypal/react-paypal-js";
import { OnApproveData } from "@paypal/paypal-js/types/components/buttons";
import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

export default function CheckoutPage() {
  const [isPaying, setIsPaying] = useState(false);
  const initialOptions: PayPalScriptOptions = {
    clientId:
      "AaRsiHsxu54Z7heT5JBRLAldv2pHS6rGqeYJSIpeT-6gcmLvJPRXgYdTmtZSZmynKr9tfX0dd36rsOSW",
    enableFunding: "venmo",
    disableFunding: "",
    buyerCountry: "US",
    currency: "USD",
    dataPageType: "product-details",
    components: "buttons,card-fields,googlepay",
    dataSdkIntegrationSource: "developer-studio",
  };

  async function createOrder() {
    try {
      const response = await fetch("/api/createorder", {
        method: "POST",
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: "1blwyeo8",
              quantity: 2,
            },
          ],
        }),
      });

      console.log(response);

      return "";

      // const orderData = await response.json();
      //
      // if (orderData.id) {
      //   return orderData.id;
      // } else {
      //   const errorDetail = orderData?.details?.[0];
      //   const errorMessage = errorDetail
      //     ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
      //     : JSON.stringify(orderData);
      //
      //   throw new Error(errorMessage);
      // }
    } catch (error) {
      console.error(error);
      return `Could not initiate PayPal Checkout...${error}`;
    }
  }

  async function onApprove(data: OnApproveData) {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      const errorDetail = orderData?.details?.[0];

      if (errorDetail || !transaction || transaction.status === "DECLINED") {
        // (2) Other non-recoverable errors -> Show a failure message
        let errorMessage;
        if (transaction) {
          errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
        } else if (errorDetail) {
          errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
        } else {
          errorMessage = JSON.stringify(orderData);
        }

        throw new Error(errorMessage);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2),
        );
        // return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
      }
    } catch (error) {
      throw new Error(
        `Sorry, your transaction could not be processed...${error}`,
      );
    }
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {/*<PayPalButtons*/}
      {/*  createOrder={createOrder}*/}
      {/*  onApprove={onApprove}*/}
      {/*  style={{*/}
      {/*    shape: "rect",*/}
      {/*    layout: "vertical",*/}
      {/*    color: "gold",*/}
      {/*    label: "paypal",*/}
      {/*  }}*/}
      {/*/>*/}

      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => console.error(err)}
        style={{
          input: {
            "font-size": "16px",
            "font-family": "courier, monospace",
            "font-weight": "lighter",
            color: "#ccc",
          },
          ".invalid": { color: "purple" },
        }}
      >
        <PayPalNumberField />
        <PayPalExpiryField />
        <PayPalCVVField />

        {/* Custom client component to handle card fields submission */}
        <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}

const SubmitPayment = ({
  isPaying,
  setIsPaying,
}: {
  isPaying: boolean;
  setIsPaying: (value: boolean) => void;
}) => {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      return alert("The payment form is invalid");
    }
    setIsPaying(true);

    cardFieldsForm.submit().catch((err) => {
      setIsPaying(false);
    });
  };

  return (
    <button
      className={isPaying ? "btn" : "btn btn-primary"}
      style={{ float: "right" }}
      onClick={handleClick}
    >
      {isPaying ? <div className="spinner tiny" /> : "Pay"}
    </button>
  );
};
