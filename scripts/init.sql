--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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
-- Name: Matches_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Matches_status_enum" AS ENUM (
    'paused',
    'waiting',
    'running',
    'finished'
);


ALTER TYPE public."Matches_status_enum" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ChannelMembers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ChannelMembers" (
    channel_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public."ChannelMembers" OWNER TO admin;

--
-- Name: ChannelMessages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ChannelMessages" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    channel_id integer
);


ALTER TABLE public."ChannelMessages" OWNER TO admin;

--
-- Name: ChannelMessages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."ChannelMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChannelMessages_id_seq" OWNER TO admin;

--
-- Name: ChannelMessages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."ChannelMessages_id_seq" OWNED BY public."ChannelMessages".id;


--
-- Name: Channels; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Channels" (
    id integer NOT NULL,
    nickname character varying NOT NULL,
    description character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Channels" OWNER TO admin;

--
-- Name: Channels_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Channels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Channels_id_seq" OWNER TO admin;

--
-- Name: Channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Channels_id_seq" OWNED BY public."Channels".id;


--
-- Name: Games; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Games" (
    id integer NOT NULL,
    name character varying NOT NULL,
    title character varying NOT NULL,
    image character varying NOT NULL,
    creator character varying NOT NULL,
    launched_at timestamp without time zone NOT NULL,
    description character varying NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Games" OWNER TO admin;

--
-- Name: Games_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Games_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Games_id_seq" OWNER TO admin;

--
-- Name: Games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Games_id_seq" OWNED BY public."Games".id;


--
-- Name: MatchEvents; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."MatchEvents" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    match_id integer,
    initiator_id integer
);


ALTER TABLE public."MatchEvents" OWNER TO admin;

--
-- Name: MatchEvents_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."MatchEvents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MatchEvents_id_seq" OWNER TO admin;

--
-- Name: MatchEvents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."MatchEvents_id_seq" OWNED BY public."MatchEvents".id;


--
-- Name: MatchPlayers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."MatchPlayers" (
    match_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public."MatchPlayers" OWNER TO admin;

--
-- Name: Matches; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Matches" (
    id integer NOT NULL,
    status public."Matches_status_enum" NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    game_id integer
);


ALTER TABLE public."Matches" OWNER TO admin;

--
-- Name: Matches_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Matches_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Matches_id_seq" OWNER TO admin;

--
-- Name: Matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Matches_id_seq" OWNED BY public."Matches".id;


--
-- Name: UserMessages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."UserMessages" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sender_id integer,
    receiver_id integer
);


ALTER TABLE public."UserMessages" OWNER TO admin;

--
-- Name: UserMessages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."UserMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserMessages_id_seq" OWNER TO admin;

--
-- Name: UserMessages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."UserMessages_id_seq" OWNED BY public."UserMessages".id;


--
-- Name: UserRelations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."UserRelations" (
    sender_id integer NOT NULL,
    receptor_id integer NOT NULL,
    status integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."UserRelations" OWNER TO admin;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    login character varying(20) NOT NULL,
    nickname character varying(20) NOT NULL,
    "isRegistered" boolean DEFAULT false NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    avatar text,
    two_factor_auth_secret text,
    two_factor_auth_enabled boolean DEFAULT false NOT NULL,
    status character varying DEFAULT 'offline'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Users" OWNER TO admin;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO admin;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: ChannelMessages id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMessages" ALTER COLUMN id SET DEFAULT nextval('public."ChannelMessages_id_seq"'::regclass);


--
-- Name: Channels id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Channels" ALTER COLUMN id SET DEFAULT nextval('public."Channels_id_seq"'::regclass);


--
-- Name: Games id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Games" ALTER COLUMN id SET DEFAULT nextval('public."Games_id_seq"'::regclass);


--
-- Name: MatchEvents id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchEvents" ALTER COLUMN id SET DEFAULT nextval('public."MatchEvents_id_seq"'::regclass);


--
-- Name: Matches id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Matches" ALTER COLUMN id SET DEFAULT nextval('public."Matches_id_seq"'::regclass);


--
-- Name: UserMessages id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserMessages" ALTER COLUMN id SET DEFAULT nextval('public."UserMessages_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: ChannelMembers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ChannelMembers" (channel_id, user_id) FROM stdin;
\.


--
-- Data for Name: ChannelMessages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ChannelMessages" (id, content, created_at, user_id, channel_id) FROM stdin;
\.


--
-- Data for Name: Channels; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Channels" (id, nickname, description, password, created_at) FROM stdin;
\.


--
-- Data for Name: Games; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Games" (id, name, title, image, creator, launched_at, description, enabled, created_at) FROM stdin;
1       pong    Pong    /images/pong/cover.png  Atari Inc.      1972-11-29 00:00:00     Pong is a classic arcade video game that simulates table tennis. It features simple two-dimensional graphics and involves players controlling paddles to hit a ball back and forth. Its straightforward gameplay and minimalist design made it a massive hit, establishing it as a pioneering title in the world of video games.    t       2023-12-12 12:15:15.837207
2       tetris  Tetris  /images/tetris/cover.png        Alexey Pajitnov 1984-06-06 00:00:00     Tetris is a tile-matching video game created by Russian software engineer Alexey Pajitnov in 1984. It has been published by several companies, most prominently during a dispute over the appropriation of the rights in the late 1980s. After a significant period of publication by Nintendo, the rights reverted to Pajitnov in 1996, who co-founded The Tetris Company with Henk Rogers to manage Tetris licensing. In 2007, the game had sold more than 100 million copies for cell phones alone, had been downloaded more than 500 million times for mobile phones, and had been played more than 1 billion times online. t    2023-12-12 12:15:48.050474
\.


--
-- Data for Name: MatchEvents; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."MatchEvents" (id, content, created_at, match_id, initiator_id) FROM stdin;
\.


--
-- Data for Name: MatchPlayers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."MatchPlayers" (match_id, user_id) FROM stdin;
1       1
1       2
2       3
2       4
\.


--
-- Data for Name: Matches; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Matches" (id, status, created_at, game_id) FROM stdin;
1       running 2023-12-12 12:16:16.692234      1
2       running 2023-12-12 12:20:14.943448      1
\.


--
-- Data for Name: UserMessages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."UserMessages" (id, content, created_at, sender_id, receiver_id) FROM stdin;
\.


--
-- Data for Name: UserRelations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."UserRelations" (sender_id, receptor_id, status) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Users" (id, login, nickname, "isRegistered", "isAdmin", avatar, two_factor_auth_secret, two_factor_auth_enabled, status, created_at) FROM stdin;
1       aborboll        aborboll        f       f       https://cdn.intra.42.fr/users/82cfc9a1ea1ad97a890578e26b0ce0c9/aborboll.jpg     \N   foffline 2023-12-12 12:11:39.749863
2       vicmarti-       vicmarti-       t       t       https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg     \N   fonline  2023-12-12 12:17:19.7025
3       msantos-        msantos-        t       t       https://cdn.intra.42.fr/users/6f0b4f02ee191ad541d1ac2fd68057c1/msantos-.jpg     \N   fonline  2023-12-12 12:18:29.962695
4       mortiz-d        mortiz-d        t       t       https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg     \N   fonline  2023-12-12 12:19:16.118174
5       josuna-t        josuna-t        t       t       https://cdn.intra.42.fr/users/2bff0a2073c645e5cf98731ae76fe446/josuna-t.jpg     \N   fonline  2023-12-12 12:19:48.81964
\.


--
-- Name: ChannelMessages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."ChannelMessages_id_seq"', 1, false);


--
-- Name: Channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Channels_id_seq"', 1, false);


--
-- Name: Games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Games_id_seq"', 2, true);


--
-- Name: MatchEvents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."MatchEvents_id_seq"', 1, false);


--
-- Name: Matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Matches_id_seq"', 2, true);


--
-- Name: UserMessages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."UserMessages_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Users_id_seq"', 5, true);


--
-- Name: Users PK_16d4f7d636df336db11d87413e3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY (id);


--
-- Name: Games PK_1950492f583d31609c5e9fbbe12; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "PK_1950492f583d31609c5e9fbbe12" PRIMARY KEY (id);


--
-- Name: UserRelations PK_257286eb3db4e4571631f9119ba; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "PK_257286eb3db4e4571631f9119ba" PRIMARY KEY (sender_id, receptor_id);


--
-- Name: MatchPlayers PK_286edaeb823ead963cf1362025d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "PK_286edaeb823ead963cf1362025d" PRIMARY KEY (match_id, user_id);


--
-- Name: ChannelMessages PK_65cc0346c694771b2331fa9d886; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "PK_65cc0346c694771b2331fa9d886" PRIMARY KEY (id);


--
-- Name: Channels PK_83bfface067961674514999d774; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "PK_83bfface067961674514999d774" PRIMARY KEY (id);


--
-- Name: MatchEvents PK_a0647ec1249948e19a7e84ba060; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "PK_a0647ec1249948e19a7e84ba060" PRIMARY KEY (id);


--
-- Name: Matches PK_ccbc29936f1b1c20729917b2c1a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Matches"
    ADD CONSTRAINT "PK_ccbc29936f1b1c20729917b2c1a" PRIMARY KEY (id);


--
-- Name: ChannelMembers PK_e00164a3679002ec6e4e4c4c4df; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "PK_e00164a3679002ec6e4e4c4c4df" PRIMARY KEY (channel_id, user_id);


--
-- Name: UserMessages PK_e1df899f8f652d3825397216139; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "PK_e1df899f8f652d3825397216139" PRIMARY KEY (id);


--
-- Name: MatchEvents REL_1d4c1d9bffd7fc04f14c04f1b1; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "REL_1d4c1d9bffd7fc04f14c04f1b1" UNIQUE (match_id);


--
-- Name: Users UQ_03599a389e75563b8314f74278b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "UQ_03599a389e75563b8314f74278b" UNIQUE (login);


--
-- Name: Users UQ_5da3f86a40ce07289424c734c98; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "UQ_5da3f86a40ce07289424c734c98" UNIQUE (nickname);


--
-- Name: IDX_3c6db54f906430893bb1f6e530; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_3c6db54f906430893bb1f6e530" ON public."ChannelMembers" USING btree (channel_id);


--
-- Name: IDX_9c5abeee0fd9cf5a74f428aa1d; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_9c5abeee0fd9cf5a74f428aa1d" ON public."MatchPlayers" USING btree (match_id);


--
-- Name: IDX_ce263353a14add85c3832f0152; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_ce263353a14add85c3832f0152" ON public."ChannelMembers" USING btree (user_id);


--
-- Name: IDX_f7c98da6be60b6d89e739ce1dc; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_f7c98da6be60b6d89e739ce1dc" ON public."MatchPlayers" USING btree (user_id);


--
-- Name: UserRelations FK_179f312ee972f6bdd6ee1b81816; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "FK_179f312ee972f6bdd6ee1b81816" FOREIGN KEY (sender_id) REFERENCES public."Users"(id);


--
-- Name: MatchEvents FK_1d4c1d9bffd7fc04f14c04f1b13; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "FK_1d4c1d9bffd7fc04f14c04f1b13" FOREIGN KEY (match_id) REFERENCES public."Matches"(id);


--
-- Name: ChannelMembers FK_3c6db54f906430893bb1f6e5303; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "FK_3c6db54f906430893bb1f6e5303" FOREIGN KEY (channel_id) REFERENCES public."Channels"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRelations FK_4c0370dc9f07872c6378e3db016; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "FK_4c0370dc9f07872c6378e3db016" FOREIGN KEY (receptor_id) REFERENCES public."Users"(id);


--
-- Name: ChannelMessages FK_96c3fe4ad9f9a49c881bda45345; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "FK_96c3fe4ad9f9a49c881bda45345" FOREIGN KEY (channel_id) REFERENCES public."Channels"(id);


--
-- Name: Matches FK_9769d116360684a526f92e15c06; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Matches"
    ADD CONSTRAINT "FK_9769d116360684a526f92e15c06" FOREIGN KEY (game_id) REFERENCES public."Games"(id);


--
-- Name: MatchEvents FK_990f186e25c053d0a5b9d03f437; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "FK_990f186e25c053d0a5b9d03f437" FOREIGN KEY (initiator_id) REFERENCES public."Users"(id);


--
-- Name: MatchPlayers FK_9c5abeee0fd9cf5a74f428aa1de; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "FK_9c5abeee0fd9cf5a74f428aa1de" FOREIGN KEY (match_id) REFERENCES public."Matches"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserMessages FK_bcb38d35921461e2a18dc32fab9; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "FK_bcb38d35921461e2a18dc32fab9" FOREIGN KEY (receiver_id) REFERENCES public."Users"(id);


--
-- Name: UserMessages FK_cd0815bc4e03939740fc9c39e34; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "FK_cd0815bc4e03939740fc9c39e34" FOREIGN KEY (sender_id) REFERENCES public."Users"(id);


--
-- Name: ChannelMembers FK_ce263353a14add85c3832f0152a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "FK_ce263353a14add85c3832f0152a" FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- Name: ChannelMessages FK_f712563554a2af0aab0b43d2304; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "FK_f712563554a2af0aab0b43d2304" FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- Name: MatchPlayers FK_f7c98da6be60b6d89e739ce1dcf; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "FK_f7c98da6be60b6d89e739ce1dcf" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
