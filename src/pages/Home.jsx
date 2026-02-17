import React, { useEffect, useState } from "react";
import { Button, Carousel, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        if (!mounted) return;
        const randomProducts = shuffle(res.data).slice(0, 6);
        setSlides(randomProducts);
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="py-5 text-center">
      <h1 className="display-5">Welcome to the FakeStore</h1>
      <p className="lead">Browse products fetched from the FakeStore API.</p>
      <div className="d-flex justify-content-center mb-4">
        <Button as={Link} to="/products" variant="primary" size="lg">
          View All Products
        </Button>
      </div>

      {/* Product image carousel */}
      {loading ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div className="mx-auto" style={{ maxWidth: 500 }}>
          <Carousel indicators={false}>
            {slides.map((p) => (
              <Carousel.Item key={p.id}>
                <div
                  className="d-flex align-items-center justify-content-center bg-white rounded"
                  style={{ height: 350 }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      maxHeight: "90%",
                      maxWidth: "80%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  className="bg-dark bg-opacity-50 rounded px-3 py-2 mt-2 text-center d-flex flex-column align-items-center justify-content-center"
                  style={{ height: 80 }}
                >
                  <h6
                    className="mb-0 text-white"
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.title}
                  </h6>
                  <small className="text-success">${p.price}</small>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}
