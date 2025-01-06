SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: f_unaccent(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.f_unaccent(text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $_$ SELECT public.unaccent('public.unaccent'::regdictionary, $1) -- schema-qualify function and dictionary $_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: brand_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_memberships (
    id integer NOT NULL,
    brand_id integer,
    user_id integer,
    admin boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    invitation_token text,
    invitation_email text
);


--
-- Name: brand_memberships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brand_memberships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brand_memberships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brand_memberships_id_seq OWNED BY public.brand_memberships.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    creator_id integer,
    name_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, public.f_unaccent(name))) STORED
);


--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: pg_search_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pg_search_documents (
    id bigint NOT NULL,
    content text,
    searchable_type character varying,
    searchable_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    content_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, public.f_unaccent(content))) STORED
);


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pg_search_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pg_search_documents_id_seq OWNED BY public.pg_search_documents.id;


--
-- Name: project_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_files (
    id integer NOT NULL,
    project_id integer,
    url character varying NOT NULL,
    filename character varying NOT NULL,
    filetype character varying,
    filesize integer NOT NULL,
    filepath character varying NOT NULL,
    uploader_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    "position" integer
);


--
-- Name: project_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_files_id_seq OWNED BY public.project_files.id;


--
-- Name: project_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_links (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    url text NOT NULL,
    title text NOT NULL,
    "position" integer NOT NULL,
    icon text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: project_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_links_id_seq OWNED BY public.project_links.id;


--
-- Name: project_promotions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_promotions (
    id integer NOT NULL,
    project_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: project_promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_promotions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_promotions_id_seq OWNED BY public.project_promotions.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title text,
    authors text,
    license text,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    min_players integer,
    max_players integer,
    length_quantity integer,
    length_units character varying,
    publication_year integer,
    brand_id integer,
    min_facilitators integer,
    max_facilitators integer,
    title_for_ordering text GENERATED ALWAYS AS (lower(regexp_replace(regexp_replace(regexp_replace(title, '^the\s+'::text, ''::text, 'i'::text), '^an?\s+'::text, ''::text, 'i'::text), '[^A-Za-z0-9]'::text, ''::text, 'g'::text))) STORED,
    title_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, public.f_unaccent(regexp_replace(regexp_replace(title, '^the\s+'::text, ''::text, 'i'::text), '^an?\s+'::text, ''::text, 'i'::text)))) STORED,
    authors_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, public.f_unaccent(authors))) STORED,
    description_vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, public.f_unaccent(description))) STORED
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: projects_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects_tags (
    project_id integer,
    tag_id integer
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: tag_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tag_categories (
    id integer NOT NULL,
    name text NOT NULL,
    color text,
    icon text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: tag_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tag_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tag_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tag_categories_id_seq OWNED BY public.tag_categories.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    tag_category_id integer
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying,
    firstname character varying,
    lastname character varying,
    admin boolean DEFAULT false,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    provider character varying,
    uid character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: brand_memberships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_memberships ALTER COLUMN id SET DEFAULT nextval('public.brand_memberships_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: pg_search_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pg_search_documents ALTER COLUMN id SET DEFAULT nextval('public.pg_search_documents_id_seq'::regclass);


--
-- Name: project_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files ALTER COLUMN id SET DEFAULT nextval('public.project_files_id_seq'::regclass);


--
-- Name: project_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_links ALTER COLUMN id SET DEFAULT nextval('public.project_links_id_seq'::regclass);


--
-- Name: project_promotions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_promotions ALTER COLUMN id SET DEFAULT nextval('public.project_promotions_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: tag_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_categories ALTER COLUMN id SET DEFAULT nextval('public.tag_categories_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: brand_memberships brand_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_memberships
    ADD CONSTRAINT brand_memberships_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: pg_search_documents pg_search_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pg_search_documents
    ADD CONSTRAINT pg_search_documents_pkey PRIMARY KEY (id);


--
-- Name: project_files project_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_pkey PRIMARY KEY (id);


--
-- Name: project_links project_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_links
    ADD CONSTRAINT project_links_pkey PRIMARY KEY (id);


--
-- Name: project_promotions project_promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_promotions
    ADD CONSTRAINT project_promotions_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: tag_categories tag_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag_categories
    ADD CONSTRAINT tag_categories_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_brands_name_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_brands_name_vector ON public.brands USING gin (name_vector);


--
-- Name: idx_pg_search_documents_content_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pg_search_documents_content_vector ON public.pg_search_documents USING gin (content_vector);


--
-- Name: idx_projects_authors_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_authors_vector ON public.projects USING gin (authors_vector);


--
-- Name: idx_projects_description_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_description_vector ON public.projects USING gin (description_vector);


--
-- Name: idx_projects_title_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_title_vector ON public.projects USING gin (title_vector);


--
-- Name: index_brand_memberships_on_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_brand_memberships_on_brand_id ON public.brand_memberships USING btree (brand_id);


--
-- Name: index_brand_memberships_on_brand_id_and_invitation_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_brand_memberships_on_brand_id_and_invitation_token ON public.brand_memberships USING btree (brand_id, invitation_token);


--
-- Name: index_brand_memberships_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_brand_memberships_on_user_id ON public.brand_memberships USING btree (user_id);


--
-- Name: index_brands_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_brands_on_name ON public.brands USING btree (name);


--
-- Name: index_brands_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_brands_on_slug ON public.brands USING btree (slug);


--
-- Name: index_pg_search_documents_on_searchable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_searchable ON public.pg_search_documents USING btree (searchable_type, searchable_id);


--
-- Name: index_project_files_on_filepath; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_project_files_on_filepath ON public.project_files USING btree (filepath);


--
-- Name: index_project_files_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_files_on_project_id ON public.project_files USING btree (project_id);


--
-- Name: index_project_links_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_links_on_project_id ON public.project_links USING btree (project_id);


--
-- Name: index_project_promotions_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_project_promotions_on_project_id ON public.project_promotions USING btree (project_id);


--
-- Name: index_projects_on_brand_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_on_brand_id ON public.projects USING btree (brand_id);


--
-- Name: index_projects_tags_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_tags_on_project_id ON public.projects_tags USING btree (project_id);


--
-- Name: index_projects_tags_on_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_tags_on_tag_id ON public.projects_tags USING btree (tag_id);


--
-- Name: index_tag_categories_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_tag_categories_on_name ON public.tag_categories USING btree (name);


--
-- Name: index_tags_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tags_on_name ON public.tags USING btree (name);


--
-- Name: index_tags_on_tag_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tags_on_tag_category_id ON public.tags USING btree (tag_category_id);


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_schema_migrations ON public.schema_migrations USING btree (version);


--
-- Name: project_promotions fk_rails_09b79d904e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_promotions
    ADD CONSTRAINT fk_rails_09b79d904e FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: tags fk_rails_1c4ed8dfc0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT fk_rails_1c4ed8dfc0 FOREIGN KEY (tag_category_id) REFERENCES public.tag_categories(id);


--
-- Name: brand_memberships fk_rails_20d57427ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_memberships
    ADD CONSTRAINT fk_rails_20d57427ce FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: project_files fk_rails_4ec2634c6a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT fk_rails_4ec2634c6a FOREIGN KEY (uploader_id) REFERENCES public.users(id);


--
-- Name: project_files fk_rails_c26fbba4b3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT fk_rails_c26fbba4b3 FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: brand_memberships fk_rails_e5e4f2d0be; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_memberships
    ADD CONSTRAINT fk_rails_e5e4f2d0be FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: project_links fk_rails_fd830a7a93; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_links
    ADD CONSTRAINT fk_rails_fd830a7a93 FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20250106185428'),
('20230430193136'),
('20230212190415'),
('20220521194451'),
('20220520150212'),
('20220520145832'),
('20220520004351'),
('20220520003728'),
('20210801180154'),
('20210801165037'),
('20210602161632'),
('20210529172435'),
('20210516160303'),
('20210515171523'),
('20190827162828'),
('20160709170550'),
('20160225202721'),
('20150711170125'),
('20150711165207'),
('20150711133945'),
('20150711124428'),
('20150711124304'),
('20150711124235'),
('20150524121642'),
('20150523164556'),
('20150517181758'),
('20150517165436'),
('20150517164853');

