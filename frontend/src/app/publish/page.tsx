'use client';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  pending_changes: { name?: string; price?: number };
};

const PendingPage = () => {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:1337/products/pending')
      .then((res) => res.json())
      .then((data: Product[]) => setPendingProducts(data));
  }, []);

  const handlePublish = (ids: number[]) => {
    fetch('http://localhost:1337/products/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })
      .then((res) => res.json())
      .then(() => {
        setPendingProducts((prevProducts) =>
          prevProducts.filter((product) => !ids.includes(product.id)),
        );
      });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <ResponsiveAppBar />
      <Typography variant="h4" margin="16px 0 0 0">Pending Products</Typography>
      {pendingProducts.map((product) => (
        <div key={product.id}>
          <Typography>Name: {product.name}</Typography>
          <Typography>Price: {product.price}</Typography>
          <Typography>
            Pending Name: {product.pending_changes.name || 'N/A'}
          </Typography>
          <Typography>
            Pending Price: {product.pending_changes.price || 'N/A'}
          </Typography>
        </div>
      ))}
      {pendingProducts.length > 0 ? (
        <Button
          onClick={() =>
            handlePublish(pendingProducts.map((product) => product.id))
          }
        >
          Publish All
        </Button>
      ) : (
        <Link href="/">No pending products, click here to get back to the dashboard.</Link>
      )}
    </Box>
  );
};

export default PendingPage;
