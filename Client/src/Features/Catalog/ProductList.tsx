import { Grid } from "@mui/material";
import { Product } from "../../App/Models/product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}
export default function ProductList(props: Props) {
  return (
    <>
      <Grid container spacing={4}>
        {props.products.map((item) => (
          <Grid key={item.id} item xs={3}>
            <ProductCard item={item} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
