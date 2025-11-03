-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cart_items (
  id_cart integer NOT NULL DEFAULT nextval('cart_items_id_cart_seq'::regclass),
  id_u integer,
  id_p integer,
  quantity integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cart_items_pkey PRIMARY KEY (id_cart),
  CONSTRAINT cart_items_id_p_fkey FOREIGN KEY (id_p) REFERENCES public.fluxshop_products(id_p)
);
CREATE TABLE public.fluxshop_products (
  id_p integer NOT NULL DEFAULT nextval('fluxshop_products_id_p_seq'::regclass),
  name_p character varying NOT NULL,
  description_p text,
  price_p numeric NOT NULL CHECK (price_p >= 0::numeric),
  image_p character varying,
  category_p character varying,
  CONSTRAINT fluxshop_products_pkey PRIMARY KEY (id_p)
);
CREATE TABLE public.permissions (
  id_permission integer NOT NULL DEFAULT nextval('permissions_id_permission_seq'::regclass),
  name_permission character varying NOT NULL UNIQUE,
  description text,
  resource character varying NOT NULL,
  action character varying NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT permissions_pkey PRIMARY KEY (id_permission)
);
CREATE TABLE public.purchase_history (
  id_purchase_history integer NOT NULL DEFAULT nextval('purchase_history_id_purchase_history_seq'::regclass),
  id_u integer NOT NULL,
  purchase_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  total_amount numeric NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['Procesando'::character varying, 'En camino'::character varying, 'Entregado'::character varying, 'Devolución'::character varying]::text[])),
  CONSTRAINT purchase_history_pkey PRIMARY KEY (id_purchase_history),
  CONSTRAINT purchase_history_id_u_fkey FOREIGN KEY (id_u) REFERENCES public.users(id_u)
);
CREATE TABLE public.purchase_items (
  id_purchase_item integer NOT NULL DEFAULT nextval('purchase_items_id_purchase_item_seq'::regclass),
  id_purchase_history integer NOT NULL,
  id_p integer NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  CONSTRAINT purchase_items_pkey PRIMARY KEY (id_purchase_item),
  CONSTRAINT purchase_items_id_purchase_history_fkey FOREIGN KEY (id_purchase_history) REFERENCES public.purchase_history(id_purchase_history),
  CONSTRAINT purchase_items_id_p_fkey FOREIGN KEY (id_p) REFERENCES public.fluxshop_products(id_p)
);
CREATE TABLE public.role_permissions (
  id_rp integer NOT NULL DEFAULT nextval('role_permissions_id_rp_seq'::regclass),
  role_id integer NOT NULL,
  permission_id integer NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT role_permissions_pkey PRIMARY KEY (id_rp),
  CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id_role),
  CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id_permission)
);
CREATE TABLE public.roles (
  id_role integer NOT NULL DEFAULT nextval('roles_id_role_seq'::regclass),
  name_role character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT roles_pkey PRIMARY KEY (id_role)
);
CREATE TABLE public.users (
  id_u integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  email character varying NOT NULL UNIQUE,
  hashed_password text NOT NULL,
  username character varying NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  is_active boolean DEFAULT true,
  last_login timestamp without time zone,
  role_id integer,
  refresh_token text,
  CONSTRAINT users_pkey PRIMARY KEY (id_u),
  CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id_role)
);