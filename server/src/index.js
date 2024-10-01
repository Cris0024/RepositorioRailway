// console.log("hello multiverse")
import express from "express";
import cors from "cors";
import IndexRoute from "./routes/index.routes.js";
import CategoryRoutes from "./routes/categories.routes.js";
import SupplierRoutes from "./routes/supplier.routes.js";
import ProductRoutes from "./routes/product.routes.js";
import SaleRoutes from "./routes/sale.routes.js";
import DetailSale from "./routes/detailSale.routes.js";
import SendingRoutes from "./routes/sending.routes.js";
import UserRoutes from "./routes/user.routes.js";
const app = express();

app.use(cors());

app.use(express.json());

app.use(IndexRoute);

app.use(CategoryRoutes);

app.use(SupplierRoutes);

app.use(ProductRoutes);

app.use(DetailSale);

app.use(SaleRoutes);

app.use(SendingRoutes);

app.use(UserRoutes);

app.listen(3000);

console.log("Server is runnig on port 3000");
