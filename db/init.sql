CREATE TABLE IF NOT EXISTS fluxshop_products (
    id_p serial PRIMARY KEY,
    name_p varchar(255) NOT NULL,
    description_p TEXT,
    price_p DECIMAL(10,2) NOT NULL CHECK (price_p >= 0),
    image_p varchar(255),
    category_p varchar(100)
);