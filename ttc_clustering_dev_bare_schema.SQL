--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: cluster_records; Type: TABLE; Schema: public; Owner: brianbancroft
--

CREATE TABLE cluster_records (
    id integer NOT NULL,
    route_id integer,
    bus_id integer,
    capture_time time without time zone,
    geometry geometry(Point,4326),
    cluster_id integer
);


ALTER TABLE cluster_records OWNER TO brianbancroft;

--
-- Name: clusters; Type: TABLE; Schema: public; Owner: brianbancroft
--

CREATE TABLE clusters (
    id integer NOT NULL,
    start_time time without time zone,
    end_time time without time zone
);


ALTER TABLE clusters OWNER TO brianbancroft;

--
-- Name: temp_records; Type: TABLE; Schema: public; Owner: brianbancroft
--

CREATE TABLE temp_records (
    id integer NOT NULL,
    route_id integer,
    bus_id integer,
    capture_time time without time zone,
    geometry geometry(Point,4326)
);


ALTER TABLE temp_records OWNER TO brianbancroft;

--
-- Data for Name: cluster_records; Type: TABLE DATA; Schema: public; Owner: brianbancroft
--

COPY cluster_records (id, route_id, bus_id, capture_time, geometry, cluster_id) FROM stdin;
\.


--
-- Data for Name: clusters; Type: TABLE DATA; Schema: public; Owner: brianbancroft
--

COPY clusters (id, start_time, end_time) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: brianbancroft
--

COPY spatial_ref_sys  FROM stdin;
\.


--
-- Data for Name: temp_records; Type: TABLE DATA; Schema: public; Owner: brianbancroft
--

COPY temp_records (id, route_id, bus_id, capture_time, geometry) FROM stdin;
\.


--
-- Name: cluster_records_pkey; Type: CONSTRAINT; Schema: public; Owner: brianbancroft
--

ALTER TABLE ONLY cluster_records
    ADD CONSTRAINT cluster_records_pkey PRIMARY KEY (id);


--
-- Name: clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: brianbancroft
--

ALTER TABLE ONLY clusters
    ADD CONSTRAINT clusters_pkey PRIMARY KEY (id);


--
-- Name: temp_records_pkey; Type: CONSTRAINT; Schema: public; Owner: brianbancroft
--

ALTER TABLE ONLY temp_records
    ADD CONSTRAINT temp_records_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

