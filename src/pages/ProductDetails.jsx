import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Image, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => mounted && setProduct(res.data))
      .catch((err) => {
        console.error(err);
        mounted && setError("Failed to load product.");
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [id]);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`https://fakestoreapi.com/products/${id}`)
      .then(() => {
        navigate("/products");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to delete product.");
      });
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!product) return null;

  return (
    <>
      <Row>
        <Col md={5} className="text-center">
          <Image
            src={product.image}
            fluid
            style={{ maxHeight: 400, objectFit: "contain" }}
          />
        </Col>
        <Col md={7}>
          <h3>{product.title}</h3>
          <p className="text-muted">Category: {product.category}</p>
          <h4 className="text-success">${product.price}</h4>
          <p>{product.description}</p>

          <div className="d-flex gap-2">
            <Button variant="primary">Add to Cart</Button>
            <Button
              variant="outline-secondary"
              as={Link}
              to={`/edit-product/${product.id}`}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Col>
      </Row>

      <ConfirmModal
        show={showConfirm}
        title="Delete Product"
        body="Are you sure you want to delete this product? This will call the FakeStoreAPI DELETE endpoint (the API is mocked and will respond with success but the data won't actually be removed)."
        onConfirm={() => {
          setShowConfirm(false);
          confirmDelete();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
