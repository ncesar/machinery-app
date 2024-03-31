'use client';
import { AlertMessage } from '@/components/AlertMessage';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
};

const IndexPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPublishAlert, setShowPublishAlert] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:1337/products')
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  const handleSave = (
    id: number,
    updatedProduct: { name: string; price: number },
  ) => {
    if (!updatedProduct.name.trim() || updatedProduct.price === null) {
      setError('Name and price cannot be empty');
      return;
    }
    fetch(`http://localhost:1337/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then((updatedProduct: Product) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? updatedProduct : product,
          ),
        );
        setError('');
        setShowPublishAlert(true);
      });
  };

  const handleCreateProduct = () => {
    if (!newProductName.trim() || newProductPrice === '') {
      setError('Name and price cannot be empty');
      return;
    }
    fetch('http://localhost:1337/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newProductName,
        price: parseFloat(newProductPrice),
      }),
    })
      .then((res) => res.json())
      .then((newProduct: Product) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setNewProductName('');
        setNewProductPrice('');
        setError('');
        setShowSuccessAlert(true);
      });
  };

  return (
    <Box>
      <ResponsiveAppBar />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        margin="16px 0 0 0"
      >
        <Typography variant="h4">Product Page</Typography>
        <Typography variant="subtitle1">
          Here you can see created products, create a new one or edit a product
        </Typography>
        <Box display="flex" flexDirection="column" margin="0 0 16px 0">
          <Box display="flex" flexDirection="row" margin="0 0 16px 0">
            <Box margin="0 16px 0 0">
              <TextField
                label="New Product Name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
            </Box>
            <Box margin="0 16px 0 0">
              <TextField
                label="New Product Price"
                type="number"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
              />
            </Box>
          </Box>
          <Button onClick={handleCreateProduct} variant="contained">
            Create Product
          </Button>
        </Box>
        <Typography variant="h5">Product List</Typography>
        <Box margin="16px 0 0 0">
          {products.length > 0 ? (
            products.map((product) => (
              <Box
                key={product.id}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Box margin="0 16px 16px 0">
                  <TextField
                    label="Name"
                    value={product.name}
                    onChange={(e) =>
                      setProducts((prevProducts) =>
                        prevProducts.map((p) =>
                          p.id === product.id
                            ? { ...p, name: e.target.value }
                            : p,
                        ),
                      )
                    }
                  />
                </Box>
                <Box margin="0 16px 16px 0">
                  <TextField
                    label="Price"
                    type="number"
                    value={product.price.toString()}
                    onChange={(e) =>
                      setProducts((prevProducts) =>
                        prevProducts.map((p) =>
                          p.id === product.id
                            ? { ...p, price: parseFloat(e.target.value) }
                            : p,
                        ),
                      )
                    }
                  />
                </Box>
                <Box margin="0 16px 16px 0">
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleSave(product.id, {
                        name: product.name,
                        price: product.price,
                      })
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="subtitle1">No products found</Typography>
          )}
        </Box>
        <AlertMessage
          open={showSuccessAlert}
          setOpen={setShowSuccessAlert}
          message="Product created successfully"
        />
        <AlertMessage
          open={showPublishAlert}
          setOpen={setShowPublishAlert}
          onClick={() => router.push('/publish')}
          message="Product was successfully changed and now needs to be publish. Click here to go to the Publish page"
        />
        {error && (
          <AlertMessage
            open={true}
            setOpen={() => setError('')}
            severity="error"
            message={error}
          />
        )}
      </Box>
    </Box>
  );
};

export default IndexPage;
