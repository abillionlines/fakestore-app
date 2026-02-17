import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        if (mounted) setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError("Failed to load products.");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h2 className="mb-4">Products</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((p) => (
          <Col key={p.id}>
            <Card className="h-100">
              <div className="text-center p-3" style={{ height: 200 }}>
                <Card.Img
                  variant="top"
                  src={p.image}
                  style={{
                    maxHeight: "100%",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate">{p.title}</Card.Title>
                <Card.Text className="fw-bold">${p.price}</Card.Text>
                <div className="mt-auto">
                  <Button
                    as={Link}
                    to={`/products/${p.id}`}
                    variant="primary"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
