import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

export default function EditProduct() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!mounted) return;
        const p = res.data;
        setTitle(p.title || "");
        setPrice(p.price || "");
        setDescription(p.description || "");
        setCategory(p.category || "");
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    axios
      .put(`https://fakestoreapi.com/products/${id}`, {
        title,
        price: parseFloat(price),
        description,
        category,
      })
      .then(() => setSuccess("Product updated (API simulated success)."))
      .catch(() => setError("Failed to update product."))
      .finally(() => setSubmitting(false));
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h2>Edit Product</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            type="number"
            step="0.01"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" disabled={submitting} variant="primary">
          {submitting ? "Updating..." : "Update Product"}
        </Button>
      </Form>
    </div>
  );
}
