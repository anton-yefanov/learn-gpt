import {
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";

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

  public get ordersController(): OrdersController {
    return this._ordersController;
  }

  public get paymentController(): PaymentsController {
    return this._paymentsController;
  }
}
