import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../App/Models/product";
import agent from "../../App/Api/agent";
import NotFound from "../../App/Errors/NotFound";
import LoadingComponent from "../../App/Layout/LoadingComponent";
import { useStoreContext } from "../../App/Context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submit, setSubmit] = useState(false);
  const finditem = basket?.items.find((item) => item.productId === product?.id);
  useEffect(() => {
    if (finditem) setQuantity(finditem.quantity);
    agent.Catalog.details(parseInt(id!))
      .then((response) => setProduct(response))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id, finditem]);
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }
  function handleUpdateCart() {
    if (!product) return;
    setSubmit(true);
    if (!finditem || quantity > finditem.quantity) {
      const updatedquantity = finditem
        ? quantity - finditem.quantity
        : quantity;
      agent.Basket.addItem(product.id!, updatedquantity)
        .then((basket) => setBasket(basket))
        .catch((err) => console.log(err))
        .finally(() => setSubmit(false));
    } else {
      const updatedquantity = finditem.quantity - quantity;
      agent.Basket.removeItem(product.id!, updatedquantity)
        .then(() => removeItem(product?.id, updatedquantity))
        .catch((err) => console.log(err))
        .finally(() => setSubmit(false));
    }
  }
  if (loading) return <LoadingComponent message="Loading product..." />;
  if (!product) return <NotFound />;
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody sx={{ fontSize: "1.1em" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant={"outlined"}
              type={"number"}
              label={"Quantity in Cart"}
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                finditem?.quantity === quantity || (!finditem && quantity === 0)
              }
              loading={submit}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color={"primary"}
              size={"large"}
              variant={"contained"}
              fullWidth
            >
              {finditem ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
