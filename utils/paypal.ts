import {
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";
import { OrderRequest } from "@paypal/paypal-server-sdk/dist/types/models/orderRequest";

export class PaypalService {
  private readonly _ordersController: OrdersController;
  private readonly _paymentsController: PaymentsController;

  constructor() {
    const client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID as string,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET as string,
      },
      timeout: 0,
      environment:
        process.env.NODE_ENV === "production"
          ? Environment.Production
          : Environment.Sandbox,

      logging: {
        logLevel: LogLevel.Info,
        logRequest: {
          logBody: true,
        },
        logResponse: {
          logHeaders: true,
        },
      },
    });

    this._ordersController = new OrdersController(client);
    this._paymentsController = new PaymentsController(client);
  }

  public createOrder = async (): Promise<string> => {
    const response = await this._ordersController.ordersCreate({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: "100",
            },
          },
        ],
      } as OrderRequest,
      prefer: "return=minimal",
    });

    const responseObject = JSON.parse(response.body as string);

    return responseObject.id;
  };

  public get ordersController(): OrdersController {
    return this._ordersController;
  }

  public get paymentController(): PaymentsController {
    return this._paymentsController;
  }
}
