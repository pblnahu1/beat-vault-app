CREATE TABLE IF NOT EXISTS users(
    id_u serial NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password text NOT NULL,
    username character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fluxshop_products(
    id_p serial NOT NULL,
    name_p character varying(255) NOT NULL,
    description_p text,
    price_p numeric(10,2) NOT NULL CHECK (price_p >= 0),
    image_p character varying(255),
    category_p character varying(100)
);

-- Productos
INSERT INTO fluxshop_products (name_p, description_p, price_p, image_p, category_p) VALUES
('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation. Features include: 40-hour battery life, premium audio drivers, comfortable over-ear design, and active noise cancellation technology. Perfect for music enthusiasts and professionals who demand the best audio experience.', 299.99, 'products_screen/headphones.jpg', 'Electronics'),
('Smart Watch Pro', 'Advanced smartwatch with health tracking features. Includes heart rate monitoring, sleep tracking, GPS, water resistance up to 50m, and a vibrant AMOLED display. Compatible with both iOS and Android devices. Perfect for fitness enthusiasts and tech-savvy individuals.', 199.99, 'products_screen/smartwath.jpg', 'Electronics'),
('Leather Laptop Bag', 'Stylish and durable leather laptop bag. Crafted from premium full-grain leather, featuring multiple compartments, padded laptop sleeve (fits up to 15"), and adjustable shoulder strap. Perfect for professionals who want to combine style with functionality.', 89.99, 'products_screen/laptopbag.jpg', 'Accessories'),
('4K Ultra HD Camera', 'Professional grade camera for stunning photography. Features a 45MP full-frame sensor, 8K video recording capability, advanced autofocus system, and weather-sealed body. Includes a versatile 24-70mm f/2.8 lens. Perfect for professional photographers and serious enthusiasts.', 799.99, 'products_screen/camera.jpg', 'Electronics');

-- Usuarios de ejemplo
-- INSERT INTO users (email, hashed_password, username) VALUES
-- ('alice@example.com', 'hashed_pw1', 'alice123'),
-- ('bob@example.com', 'hashed_pw2', 'bobby'),
-- ('carla@example.com', 'hashed_pw3', 'carla_dev');
