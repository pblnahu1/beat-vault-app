-- consultas básicas de selección

-- selecciono todos los usuarios
select * from users;
-- selecciono todos los productos
select * from fluxshop_products;
-- selecciono todos los items del carrito
select * from cart_items;


-- usuario test
INSERT INTO users (email, hashed_password, username) 
VALUES ('usuario@ejemplo.com', 'password_hash', 'usuario_test');


-- consultas con filtros

-- obtnego usuarios creados en el último mes
select * from users 
where created_at >= now() - interval '1 month';

-- obtengo productos de una cat específica
select * from fluxshop_products
where category_p = 'electronics';

-- obtengo productos con precio mayor a $100
select * from fluxshop_products
where price_p > 100;


-- consultas con join

-- obtengo los items del carrito con info de prod y user
select ci.id_cart, u.username, p.name_p, p.price_p, ci.quantity, (p.price_p * ci.quantity) as total
from cart_items ci
join users u on ci.id_u = u.id_u
join fluxshop_products p on ci.id_p = p.id_p;

-- obtengo todos los productos en el carrito de un usuario especifico
select p.name_p, p.price, ci.quantity, (p.price_p * ci.quantity) as total
from cart_items ci
join fluxshop_products p on ci.id_p = p.id_p
where ci.id_u = 1;


-- consultas de agregacion

-- obtengo el total gastado por cada usuario
select u.username, sum(p.price_p * ci.quantity) as total_spent
from cart_items ci
join users u on ci.id_u = u.id_u
join fluxshop_products p on ci.id_p = p.id_p
group by u.username;
order by total_spent desc;

-- cuento productos por categoria
select category_p, count(*) as product_count, avg(price_p) as avg_price
from fluxshop_products
group by category_p
order by product_count desc;

-- encontrar los 5 productos más caros
select name_p, price_p
from fluxshop_products
order by price_p desc
limit 5;


-- otras

-- obtengo productos q nadie agrego al carrito
select p.id_p, p.name_p
from fluxshop_products p 
left join cart_items ci on p.id_p = ci.id_p
where ci.id_p is null;

-- obtengo usuairos que agregaron productos de todas las categorias
select u.username 
from users u 
where not exists (
    select distinct category_p
    from fluxshop_products
    where not exists (
        select 1 
        from cart_items ci
        join fluxshop_products p on ci.id_p = p.id_p
        where ci.id_u = u.id_u and category_p = fluxshop_products.category_p
    )
);

-- obtengo el producto más famoso (más veces agregado al carrito)
select p.name_p, sum(ci.quantity) as total_quantity
from cart_items ci
join fluxshop_products p on ci.id_p = p.id_p
group by p.name_p
order by total_quantity desc
limit 1;





----- testeo para la tabla cart_items
-- Insertar un usuario primero
INSERT INTO users (email, hashed_password, username) 
VALUES ('test@example.com', 'hashed_password_here', 'testuser');

-- Insertar un producto
INSERT INTO fluxshop_products (name_p, description_p, price_p, category_p) 
VALUES ('Producto Test', 'Descripción del producto', 29.99, 'test');

-- Insertar cart_item con referencias correctas
INSERT INTO cart_items (id_u, id_p, quantity) 
VALUES (1, 1, 2);







ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


ALTER TABLE cart_items 
ADD CONSTRAINT unique_user_product UNIQUE (id_u, id_p);



CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(id_u);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(id_p);