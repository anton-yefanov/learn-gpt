import { PaypalService } from "@/utils/paypal";
import { ApiError } from "@apimatic/core";
import { NextRequest, NextResponse } from "next/server";
import { OrderRequest } from "@paypal/paypal-server-sdk/dist/types/models/orderRequest";

export async function POST(req: NextRequest) {
  const paypalService = new PaypalService();

  paypalService.createOrder().then((orderId) => {
    return new NextResponse(orderId);
  });

  // try {
  //   const { body, ...httpResponse } =
  //     await paypalService.ordersController.ordersCreate({
  //       body: {
  //         intent: "CAPTURE",
  //         purchaseUnits: [
  //           {
  //             amount: {
  //               currencyCode: "USD",
  //               value: "100",
  //             },
  //           },
  //         ],
  //       } as OrderRequest,
  //       prefer: "return=minimal",
  //     });
  //
  //   return new NextResponse(JSON.parse(body as string), {
  //     status: httpResponse.statusCode,
  //   });
  // } catch (err) {
  //   if (err instanceof ApiError) {
  //     throw new Error(err.message);
  //   }
  // }
}
