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