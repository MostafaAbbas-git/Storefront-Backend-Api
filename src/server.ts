import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import articleRoutes from './handlers/books';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import ordersRoutes from './handlers/orders';
import dashboardRoutes from './handlers/dashboard';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

const corsOptions = {
  origin: 'http://localhost',
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

articleRoutes(app);
productRoutes(app);
ordersRoutes(app);
userRoutes(app);
dashboardRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
