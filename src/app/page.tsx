'use client'
import { IProduct } from "@/lib/Types/Product";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const products = await res.json();
    console.log(products);

    return products;
  };

  useEffect(() => {
    fetchProducts().then((p) => {
      setProducts(p);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <h1>Products</h1>
      {products.map((p: IProduct) => (
        <div key={p._id}>
          <h2>{p.name}</h2>
          <h2>{p.description}</h2>
          <h2>{p.price}</h2>
        </div>
      ))}
    </div>
  );
}
