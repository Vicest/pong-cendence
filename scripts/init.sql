PGDMP  *    )                {            transcendence    16.1    16.1 S    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384    transcendence    DATABASE     x   CREATE DATABASE transcendence WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE transcendence;
                admin    false            X           1247    16386    Matches_status_enum    TYPE     q   CREATE TYPE public."Matches_status_enum" AS ENUM (
    'paused',
    'waiting',
    'running',
    'finished'
);
 (   DROP TYPE public."Matches_status_enum";
       public          admin    false            �            1259    16395    ChannelMembers    TABLE     h   CREATE TABLE public."ChannelMembers" (
    channel_id integer NOT NULL,
    user_id integer NOT NULL
);
 $   DROP TABLE public."ChannelMembers";
       public         heap    admin    false            �            1259    16398    ChannelMessages    TABLE     �   CREATE TABLE public."ChannelMessages" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    channel_id integer
);
 %   DROP TABLE public."ChannelMessages";
       public         heap    admin    false            �            1259    16404    ChannelMessages_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ChannelMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."ChannelMessages_id_seq";
       public          admin    false    216            �           0    0    ChannelMessages_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."ChannelMessages_id_seq" OWNED BY public."ChannelMessages".id;
          public          admin    false    217            �            1259    16405    Channels    TABLE     �   CREATE TABLE public."Channels" (
    id integer NOT NULL,
    nickname character varying NOT NULL,
    description character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public."Channels";
       public         heap    admin    false            �            1259    16411    Channels_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Channels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Channels_id_seq";
       public          admin    false    218            �           0    0    Channels_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Channels_id_seq" OWNED BY public."Channels".id;
          public          admin    false    219            �            1259    16412    Games    TABLE     �  CREATE TABLE public."Games" (
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
    DROP TABLE public."Games";
       public         heap    admin    false            �            1259    16419    Games_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Games_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Games_id_seq";
       public          admin    false    220            �           0    0    Games_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Games_id_seq" OWNED BY public."Games".id;
          public          admin    false    221            �            1259    16420    MatchEvents    TABLE     �   CREATE TABLE public."MatchEvents" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    match_id integer,
    initiator_id integer
);
 !   DROP TABLE public."MatchEvents";
       public         heap    admin    false            �            1259    16426    MatchEvents_id_seq    SEQUENCE     �   CREATE SEQUENCE public."MatchEvents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."MatchEvents_id_seq";
       public          admin    false    222            �           0    0    MatchEvents_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."MatchEvents_id_seq" OWNED BY public."MatchEvents".id;
          public          admin    false    223            �            1259    16427    MatchPlayers    TABLE     d   CREATE TABLE public."MatchPlayers" (
    match_id integer NOT NULL,
    user_id integer NOT NULL
);
 "   DROP TABLE public."MatchPlayers";
       public         heap    admin    false            �            1259    16430    Matches    TABLE     �   CREATE TABLE public."Matches" (
    id integer NOT NULL,
    status public."Matches_status_enum" NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    game_id integer
);
    DROP TABLE public."Matches";
       public         heap    admin    false    856            �            1259    16434    Matches_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Matches_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Matches_id_seq";
       public          admin    false    225            �           0    0    Matches_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Matches_id_seq" OWNED BY public."Matches".id;
          public          admin    false    226            �            1259    16435    UserMessages    TABLE     �   CREATE TABLE public."UserMessages" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sender_id integer,
    receiver_id integer
);
 "   DROP TABLE public."UserMessages";
       public         heap    admin    false            �            1259    16441    UserMessages_id_seq    SEQUENCE     �   CREATE SEQUENCE public."UserMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."UserMessages_id_seq";
       public          admin    false    227            �           0    0    UserMessages_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."UserMessages_id_seq" OWNED BY public."UserMessages".id;
          public          admin    false    228            �            1259    16442    UserRelations    TABLE     �   CREATE TABLE public."UserRelations" (
    sender_id integer NOT NULL,
    receptor_id integer NOT NULL,
    status integer DEFAULT 0 NOT NULL
);
 #   DROP TABLE public."UserRelations";
       public         heap    admin    false            �            1259    16446    Users    TABLE     �  CREATE TABLE public."Users" (
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
    DROP TABLE public."Users";
       public         heap    admin    false            �            1259    16456    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public          admin    false    230            �           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public          admin    false    231            �           2604    16457    ChannelMessages id    DEFAULT     |   ALTER TABLE ONLY public."ChannelMessages" ALTER COLUMN id SET DEFAULT nextval('public."ChannelMessages_id_seq"'::regclass);
 C   ALTER TABLE public."ChannelMessages" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    217    216            �           2604    16458    Channels id    DEFAULT     n   ALTER TABLE ONLY public."Channels" ALTER COLUMN id SET DEFAULT nextval('public."Channels_id_seq"'::regclass);
 <   ALTER TABLE public."Channels" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    219    218            �           2604    16459    Games id    DEFAULT     h   ALTER TABLE ONLY public."Games" ALTER COLUMN id SET DEFAULT nextval('public."Games_id_seq"'::regclass);
 9   ALTER TABLE public."Games" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    221    220            �           2604    16460    MatchEvents id    DEFAULT     t   ALTER TABLE ONLY public."MatchEvents" ALTER COLUMN id SET DEFAULT nextval('public."MatchEvents_id_seq"'::regclass);
 ?   ALTER TABLE public."MatchEvents" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    223    222            �           2604    16461 
   Matches id    DEFAULT     l   ALTER TABLE ONLY public."Matches" ALTER COLUMN id SET DEFAULT nextval('public."Matches_id_seq"'::regclass);
 ;   ALTER TABLE public."Matches" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    226    225            �           2604    16462    UserMessages id    DEFAULT     v   ALTER TABLE ONLY public."UserMessages" ALTER COLUMN id SET DEFAULT nextval('public."UserMessages_id_seq"'::regclass);
 @   ALTER TABLE public."UserMessages" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    228    227            �           2604    16463    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    231    230            �          0    16395    ChannelMembers 
   TABLE DATA           ?   COPY public."ChannelMembers" (channel_id, user_id) FROM stdin;
    public          admin    false    215            �          0    16398    ChannelMessages 
   TABLE DATA           Y   COPY public."ChannelMessages" (id, content, created_at, user_id, channel_id) FROM stdin;
    public          admin    false    216            �          0    16405    Channels 
   TABLE DATA           U   COPY public."Channels" (id, nickname, description, password, created_at) FROM stdin;
    public          admin    false    218            �          0    16412    Games 
   TABLE DATA           q   COPY public."Games" (id, name, title, image, creator, launched_at, description, enabled, created_at) FROM stdin;
    public          admin    false    220            �          0    16420    MatchEvents 
   TABLE DATA           X   COPY public."MatchEvents" (id, content, created_at, match_id, initiator_id) FROM stdin;
    public          admin    false    222            �          0    16427    MatchPlayers 
   TABLE DATA           ;   COPY public."MatchPlayers" (match_id, user_id) FROM stdin;
    public          admin    false    224            �          0    16430    Matches 
   TABLE DATA           D   COPY public."Matches" (id, status, created_at, game_id) FROM stdin;
    public          admin    false    225            �          0    16435    UserMessages 
   TABLE DATA           Y   COPY public."UserMessages" (id, content, created_at, sender_id, receiver_id) FROM stdin;
    public          admin    false    227            �          0    16442    UserRelations 
   TABLE DATA           I   COPY public."UserRelations" (sender_id, receptor_id, status) FROM stdin;
    public          admin    false    229            �          0    16446    Users 
   TABLE DATA           �   COPY public."Users" (id, login, nickname, "isRegistered", "isAdmin", avatar, two_factor_auth_secret, two_factor_auth_enabled, status, created_at) FROM stdin;
    public          admin    false    230            �           0    0    ChannelMessages_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."ChannelMessages_id_seq"', 1, false);
          public          admin    false    217            �           0    0    Channels_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Channels_id_seq"', 1, false);
          public          admin    false    219            �           0    0    Games_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Games_id_seq"', 2, true);
          public          admin    false    221            �           0    0    MatchEvents_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."MatchEvents_id_seq"', 1, false);
          public          admin    false    223            �           0    0    Matches_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Matches_id_seq"', 2, true);
          public          admin    false    226            �           0    0    UserMessages_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."UserMessages_id_seq"', 1, false);
          public          admin    false    228            �           0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 5, true);
          public          admin    false    231                       2606    24589 $   Users PK_16d4f7d636df336db11d87413e3 
   CONSTRAINT     f   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "PK_16d4f7d636df336db11d87413e3";
       public            admin    false    230            �           2606    24601 $   Games PK_1950492f583d31609c5e9fbbe12 
   CONSTRAINT     f   ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "PK_1950492f583d31609c5e9fbbe12" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."Games" DROP CONSTRAINT "PK_1950492f583d31609c5e9fbbe12";
       public            admin    false    220                       2606    24577 ,   UserRelations PK_257286eb3db4e4571631f9119ba 
   CONSTRAINT     �   ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "PK_257286eb3db4e4571631f9119ba" PRIMARY KEY (sender_id, receptor_id);
 Z   ALTER TABLE ONLY public."UserRelations" DROP CONSTRAINT "PK_257286eb3db4e4571631f9119ba";
       public            admin    false    229    229                        2606    24581 +   MatchPlayers PK_286edaeb823ead963cf1362025d 
   CONSTRAINT     |   ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "PK_286edaeb823ead963cf1362025d" PRIMARY KEY (match_id, user_id);
 Y   ALTER TABLE ONLY public."MatchPlayers" DROP CONSTRAINT "PK_286edaeb823ead963cf1362025d";
       public            admin    false    224    224            �           2606    24583 .   ChannelMessages PK_65cc0346c694771b2331fa9d886 
   CONSTRAINT     p   ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "PK_65cc0346c694771b2331fa9d886" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public."ChannelMessages" DROP CONSTRAINT "PK_65cc0346c694771b2331fa9d886";
       public            admin    false    216            �           2606    24585 '   Channels PK_83bfface067961674514999d774 
   CONSTRAINT     i   ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "PK_83bfface067961674514999d774" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public."Channels" DROP CONSTRAINT "PK_83bfface067961674514999d774";
       public            admin    false    218            �           2606    24595 *   MatchEvents PK_a0647ec1249948e19a7e84ba060 
   CONSTRAINT     l   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "PK_a0647ec1249948e19a7e84ba060" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "PK_a0647ec1249948e19a7e84ba060";
       public            admin    false    222                       2606    24599 &   Matches PK_ccbc29936f1b1c20729917b2c1a 
   CONSTRAINT     h   ALTER TABLE ONLY public."Matches"
    ADD CONSTRAINT "PK_ccbc29936f1b1c20729917b2c1a" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."Matches" DROP CONSTRAINT "PK_ccbc29936f1b1c20729917b2c1a";
       public            admin    false    225            �           2606    24579 -   ChannelMembers PK_e00164a3679002ec6e4e4c4c4df 
   CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "PK_e00164a3679002ec6e4e4c4c4df" PRIMARY KEY (channel_id, user_id);
 [   ALTER TABLE ONLY public."ChannelMembers" DROP CONSTRAINT "PK_e00164a3679002ec6e4e4c4c4df";
       public            admin    false    215    215                       2606    24587 +   UserMessages PK_e1df899f8f652d3825397216139 
   CONSTRAINT     m   ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "PK_e1df899f8f652d3825397216139" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public."UserMessages" DROP CONSTRAINT "PK_e1df899f8f652d3825397216139";
       public            admin    false    227            
           2606    24591 $   Users UQ_03599a389e75563b8314f74278b 
   CONSTRAINT     d   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "UQ_03599a389e75563b8314f74278b" UNIQUE (login);
 R   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "UQ_03599a389e75563b8314f74278b";
       public            admin    false    230            �           2606    24597 *   MatchEvents UQ_1d4c1d9bffd7fc04f14c04f1b13 
   CONSTRAINT     m   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "UQ_1d4c1d9bffd7fc04f14c04f1b13" UNIQUE (match_id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "UQ_1d4c1d9bffd7fc04f14c04f1b13";
       public            admin    false    222                       2606    24593 $   Users UQ_5da3f86a40ce07289424c734c98 
   CONSTRAINT     g   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "UQ_5da3f86a40ce07289424c734c98" UNIQUE (nickname);
 R   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "UQ_5da3f86a40ce07289424c734c98";
       public            admin    false    230            �           1259    24602    IDX_3c6db54f906430893bb1f6e530    INDEX     c   CREATE INDEX "IDX_3c6db54f906430893bb1f6e530" ON public."ChannelMembers" USING btree (channel_id);
 4   DROP INDEX public."IDX_3c6db54f906430893bb1f6e530";
       public            admin    false    215            �           1259    24604    IDX_9c5abeee0fd9cf5a74f428aa1d    INDEX     _   CREATE INDEX "IDX_9c5abeee0fd9cf5a74f428aa1d" ON public."MatchPlayers" USING btree (match_id);
 4   DROP INDEX public."IDX_9c5abeee0fd9cf5a74f428aa1d";
       public            admin    false    224            �           1259    24603    IDX_ce263353a14add85c3832f0152    INDEX     `   CREATE INDEX "IDX_ce263353a14add85c3832f0152" ON public."ChannelMembers" USING btree (user_id);
 4   DROP INDEX public."IDX_ce263353a14add85c3832f0152";
       public            admin    false    215            �           1259    24605    IDX_f7c98da6be60b6d89e739ce1dc    INDEX     ^   CREATE INDEX "IDX_f7c98da6be60b6d89e739ce1dc" ON public."MatchPlayers" USING btree (user_id);
 4   DROP INDEX public."IDX_f7c98da6be60b6d89e739ce1dc";
       public            admin    false    224                       2606    24626 ,   UserRelations FK_179f312ee972f6bdd6ee1b81816    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "FK_179f312ee972f6bdd6ee1b81816" FOREIGN KEY (sender_id) REFERENCES public."Users"(id);
 Z   ALTER TABLE ONLY public."UserRelations" DROP CONSTRAINT "FK_179f312ee972f6bdd6ee1b81816";
       public          admin    false    3336    229    230                       2606    24636 *   MatchEvents FK_1d4c1d9bffd7fc04f14c04f1b13    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "FK_1d4c1d9bffd7fc04f14c04f1b13" FOREIGN KEY (match_id) REFERENCES public."Matches"(id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "FK_1d4c1d9bffd7fc04f14c04f1b13";
       public          admin    false    225    3330    222                       2606    24651 -   ChannelMembers FK_3c6db54f906430893bb1f6e5303    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "FK_3c6db54f906430893bb1f6e5303" FOREIGN KEY (channel_id) REFERENCES public."Channels"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 [   ALTER TABLE ONLY public."ChannelMembers" DROP CONSTRAINT "FK_3c6db54f906430893bb1f6e5303";
       public          admin    false    3318    215    218                       2606    24631 ,   UserRelations FK_4c0370dc9f07872c6378e3db016    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "FK_4c0370dc9f07872c6378e3db016" FOREIGN KEY (receptor_id) REFERENCES public."Users"(id);
 Z   ALTER TABLE ONLY public."UserRelations" DROP CONSTRAINT "FK_4c0370dc9f07872c6378e3db016";
       public          admin    false    229    230    3336                       2606    24611 .   ChannelMessages FK_96c3fe4ad9f9a49c881bda45345    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "FK_96c3fe4ad9f9a49c881bda45345" FOREIGN KEY (channel_id) REFERENCES public."Channels"(id);
 \   ALTER TABLE ONLY public."ChannelMessages" DROP CONSTRAINT "FK_96c3fe4ad9f9a49c881bda45345";
       public          admin    false    3318    218    216                       2606    24646 &   Matches FK_9769d116360684a526f92e15c06    FK CONSTRAINT     �   ALTER TABLE ONLY public."Matches"
    ADD CONSTRAINT "FK_9769d116360684a526f92e15c06" FOREIGN KEY (game_id) REFERENCES public."Games"(id);
 T   ALTER TABLE ONLY public."Matches" DROP CONSTRAINT "FK_9769d116360684a526f92e15c06";
       public          admin    false    3320    225    220                       2606    24641 *   MatchEvents FK_990f186e25c053d0a5b9d03f437    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "FK_990f186e25c053d0a5b9d03f437" FOREIGN KEY (initiator_id) REFERENCES public."Users"(id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "FK_990f186e25c053d0a5b9d03f437";
       public          admin    false    222    230    3336                       2606    24661 +   MatchPlayers FK_9c5abeee0fd9cf5a74f428aa1de    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "FK_9c5abeee0fd9cf5a74f428aa1de" FOREIGN KEY (match_id) REFERENCES public."Matches"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."MatchPlayers" DROP CONSTRAINT "FK_9c5abeee0fd9cf5a74f428aa1de";
       public          admin    false    224    225    3330                       2606    24621 +   UserMessages FK_bcb38d35921461e2a18dc32fab9    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "FK_bcb38d35921461e2a18dc32fab9" FOREIGN KEY (receiver_id) REFERENCES public."Users"(id);
 Y   ALTER TABLE ONLY public."UserMessages" DROP CONSTRAINT "FK_bcb38d35921461e2a18dc32fab9";
       public          admin    false    227    230    3336                       2606    24616 +   UserMessages FK_cd0815bc4e03939740fc9c39e34    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "FK_cd0815bc4e03939740fc9c39e34" FOREIGN KEY (sender_id) REFERENCES public."Users"(id);
 Y   ALTER TABLE ONLY public."UserMessages" DROP CONSTRAINT "FK_cd0815bc4e03939740fc9c39e34";
       public          admin    false    227    3336    230                       2606    24656 -   ChannelMembers FK_ce263353a14add85c3832f0152a    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "FK_ce263353a14add85c3832f0152a" FOREIGN KEY (user_id) REFERENCES public."Users"(id);
 [   ALTER TABLE ONLY public."ChannelMembers" DROP CONSTRAINT "FK_ce263353a14add85c3832f0152a";
       public          admin    false    215    230    3336                       2606    24606 .   ChannelMessages FK_f712563554a2af0aab0b43d2304    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "FK_f712563554a2af0aab0b43d2304" FOREIGN KEY (user_id) REFERENCES public."Users"(id);
 \   ALTER TABLE ONLY public."ChannelMessages" DROP CONSTRAINT "FK_f712563554a2af0aab0b43d2304";
       public          admin    false    230    216    3336                       2606    24666 +   MatchPlayers FK_f7c98da6be60b6d89e739ce1dcf    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "FK_f7c98da6be60b6d89e739ce1dcf" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."MatchPlayers" DROP CONSTRAINT "FK_f7c98da6be60b6d89e739ce1dcf";
       public          admin    false    230    3336    224            �      x������ � �      �      x������ � �      �      x������ � �      �   x  x�eS�n�0=;_�H\�횤�b��2E��0ms�%A����G��n�a4����Ӷ
�ճ�nxҍVn:�X)?f�O����a�n��M{��y(O9
� ���w��CCpbC��O��L	2��9N5<e�	����u����ޡ�!b��!� ���'i/t���e!��#<������W�V��>�QGʨ��1K����X�&v"���P����+�I�<�⯁�.�i���[�(j)s�}؉g��_I��*Wm��n��l��C�h����nwhWm�)GN�����h�^�d�]�rv�$V��6ͽ<�Z0�2[�L����ʫ.�d�x��Y6E��Y4" 7�n�L�u`1s�D�\�Y�	S���S@ǔ�0y�7D/b���f.�!Na��]Q��ȘEZUP�Q�K�j��D#�z�DP���C|Q���(a���D���5hT�*����5�G/�lz?;#=�r�]ۯe��9������AC*8:��S(h�� �9h�f�(&�hDu	��c�>2�i$��ra�� 
j��#�w%p⪕Ϻ.v֣R����
'�[`&�@����S��'*p����=����$��뽬��V?��j�dۄ      �      x������ � �      �      x�3�4�2�4�2�4b�=... m�      �   @   x�3�,*����K�4202�54"CK+#K+K=cs3cNC.#�ʌM�,,-�-��b���� 3�      �      x������ � �      �      x������ � �      �   .  x���MN�0F��)�@������Ǳ��M�$e��1H���,������s��e;w�o�z��v[{��8��-IYRu���,��Kao�˔m�n�h�I�K�`��m���"NϢ�y���"�tH힐{�=X{2҈뚦m^��#��`+P)ȘFgqĔ��>����N�#�XEF�FZq�[�G7>�8�a�w �[�L	�8:�PB5V��?q��`�t�m^�Sj���q
�B"&���r��|-�z���RB�N�1E�e�/��D�5s�6R�6J,��2��uT����L��<))�'~N�I      S    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384    transcendence    DATABASE     x   CREATE DATABASE transcendence WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE transcendence;
                admin    false            X           1247    16386    Matches_status_enum    TYPE     q   CREATE TYPE public."Matches_status_enum" AS ENUM (
    'paused',
    'waiting',
    'running',
    'finished'
);
 (   DROP TYPE public."Matches_status_enum";
       public          admin    false            �            1259    16395    ChannelMembers    TABLE     h   CREATE TABLE public."ChannelMembers" (
    channel_id integer NOT NULL,
    user_id integer NOT NULL
);
 $   DROP TABLE public."ChannelMembers";
       public         heap    admin    false            �            1259    16398    ChannelMessages    TABLE     �   CREATE TABLE public."ChannelMessages" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    channel_id integer
);
 %   DROP TABLE public."ChannelMessages";
       public         heap    admin    false            �            1259    16404    ChannelMessages_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ChannelMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."ChannelMessages_id_seq";
       public          admin    false    216            �           0    0    ChannelMessages_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."ChannelMessages_id_seq" OWNED BY public."ChannelMessages".id;
          public          admin    false    217            �            1259    16405    Channels    TABLE     �   CREATE TABLE public."Channels" (
    id integer NOT NULL,
    nickname character varying NOT NULL,
    description character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public."Channels";
       public         heap    admin    false            �            1259    16411    Channels_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Channels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Channels_id_seq";
       public          admin    false    218            �           0    0    Channels_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Channels_id_seq" OWNED BY public."Channels".id;
          public          admin    false    219            �            1259    16412    Games    TABLE     �  CREATE TABLE public."Games" (
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
    DROP TABLE public."Games";
       public         heap    admin    false            �            1259    16419    Games_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Games_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Games_id_seq";
       public          admin    false    220            �           0    0    Games_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Games_id_seq" OWNED BY public."Games".id;
          public          admin    false    221            �            1259    16420    MatchEvents    TABLE     �   CREATE TABLE public."MatchEvents" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    match_id integer,
    initiator_id integer
);
 !   DROP TABLE public."MatchEvents";
       public         heap    admin    false            �            1259    16426    MatchEvents_id_seq    SEQUENCE     �   CREATE SEQUENCE public."MatchEvents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."MatchEvents_id_seq";
       public          admin    false    222            �           0    0    MatchEvents_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."MatchEvents_id_seq" OWNED BY public."MatchEvents".id;
          public          admin    false    223            �            1259    16427    MatchPlayers    TABLE     d   CREATE TABLE public."MatchPlayers" (
    match_id integer NOT NULL,
    user_id integer NOT NULL
);
 "   DROP TABLE public."MatchPlayers";
       public         heap    admin    false            �            1259    16430    Matches    TABLE     �   CREATE TABLE public."Matches" (
    id integer NOT NULL,
    status public."Matches_status_enum" NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    game_id integer
);
    DROP TABLE public."Matches";
       public         heap    admin    false    856            �            1259    16434    Matches_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Matches_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Matches_id_seq";
       public          admin    false    225            �           0    0    Matches_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Matches_id_seq" OWNED BY public."Matches".id;
          public          admin    false    226            �            1259    16435    UserMessages    TABLE     �   CREATE TABLE public."UserMessages" (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sender_id integer,
    receiver_id integer
);
 "   DROP TABLE public."UserMessages";
       public         heap    admin    false            �            1259    16441    UserMessages_id_seq    SEQUENCE     �   CREATE SEQUENCE public."UserMessages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."UserMessages_id_seq";
       public          admin    false    227            �           0    0    UserMessages_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."UserMessages_id_seq" OWNED BY public."UserMessages".id;
          public          admin    false    228            �            1259    16442    UserRelations    TABLE     �   CREATE TABLE public."UserRelations" (
    sender_id integer NOT NULL,
    receptor_id integer NOT NULL,
    status integer DEFAULT 0 NOT NULL
);
 #   DROP TABLE public."UserRelations";
       public         heap    admin    false            �            1259    16446    Users    TABLE     �  CREATE TABLE public."Users" (
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
    DROP TABLE public."Users";
       public         heap    admin    false            �            1259    16456    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public          admin    false    230            �           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public          admin    false    231            �           2604    16457    ChannelMessages id    DEFAULT     |   ALTER TABLE ONLY public."ChannelMessages" ALTER COLUMN id SET DEFAULT nextval('public."ChannelMessages_id_seq"'::regclass);
 C   ALTER TABLE public."ChannelMessages" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    217    216            �           2604    16458    Channels id    DEFAULT     n   ALTER TABLE ONLY public."Channels" ALTER COLUMN id SET DEFAULT nextval('public."Channels_id_seq"'::regclass);
 <   ALTER TABLE public."Channels" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    219    218            �           2604    16459    Games id    DEFAULT     h   ALTER TABLE ONLY public."Games" ALTER COLUMN id SET DEFAULT nextval('public."Games_id_seq"'::regclass);
 9   ALTER TABLE public."Games" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    221    220            �           2604    16460    MatchEvents id    DEFAULT     t   ALTER TABLE ONLY public."MatchEvents" ALTER COLUMN id SET DEFAULT nextval('public."MatchEvents_id_seq"'::regclass);
 ?   ALTER TABLE public."MatchEvents" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    223    222            �           2604    16461 
   Matches id    DEFAULT     l   ALTER TABLE ONLY public."Matches" ALTER COLUMN id SET DEFAULT nextval('public."Matches_id_seq"'::regclass);
 ;   ALTER TABLE public."Matches" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    226    225            �           2604    16462    UserMessages id    DEFAULT     v   ALTER TABLE ONLY public."UserMessages" ALTER COLUMN id SET DEFAULT nextval('public."UserMessages_id_seq"'::regclass);
 @   ALTER TABLE public."UserMessages" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    228    227            �           2604    16463    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public          admin    false    231    230            �          0    16395    ChannelMembers 
   TABLE DATA           ?   COPY public."ChannelMembers" (channel_id, user_id) FROM stdin;
    public          admin    false    215   Bh       �          0    16398    ChannelMessages 
   TABLE DATA           Y   COPY public."ChannelMessages" (id, content, created_at, user_id, channel_id) FROM stdin;
    public          admin    false    216   _h       �          0    16405    Channels 
   TABLE DATA           U   COPY public."Channels" (id, nickname, description, password, created_at) FROM stdin;
    public          admin    false    218   |h       �          0    16412    Games 
   TABLE DATA           q   COPY public."Games" (id, name, title, image, creator, launched_at, description, enabled, created_at) FROM stdin;
    public          admin    false    220   �h       �          0    16420    MatchEvents 
   TABLE DATA           X   COPY public."MatchEvents" (id, content, created_at, match_id, initiator_id) FROM stdin;
    public          admin    false    222   !k       �          0    16427    MatchPlayers 
   TABLE DATA           ;   COPY public."MatchPlayers" (match_id, user_id) FROM stdin;
    public          admin    false    224   >k       �          0    16430    Matches 
   TABLE DATA           D   COPY public."Matches" (id, status, created_at, game_id) FROM stdin;
    public          admin    false    225   ik       �          0    16435    UserMessages 
   TABLE DATA           Y   COPY public."UserMessages" (id, content, created_at, sender_id, receiver_id) FROM stdin;
    public          admin    false    227   �k       �          0    16442    UserRelations 
   TABLE DATA           I   COPY public."UserRelations" (sender_id, receptor_id, status) FROM stdin;
    public          admin    false    229   �k       �          0    16446    Users 
   TABLE DATA           �   COPY public."Users" (id, login, nickname, "isRegistered", "isAdmin", avatar, two_factor_auth_secret, two_factor_auth_enabled, status, created_at) FROM stdin;
    public          admin    false    230   �k       �           0    0    ChannelMessages_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."ChannelMessages_id_seq"', 1, false);
          public          admin    false    217            �           0    0    Channels_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Channels_id_seq"', 1, false);
          public          admin    false    219            �           0    0    Games_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Games_id_seq"', 2, true);
          public          admin    false    221            �           0    0    MatchEvents_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."MatchEvents_id_seq"', 1, false);
          public          admin    false    223            �           0    0    Matches_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Matches_id_seq"', 2, true);
          public          admin    false    226            �           0    0    UserMessages_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."UserMessages_id_seq"', 1, false);
          public          admin    false    228            �           0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 5, true);
          public          admin    false    231                       2606    24589 $   Users PK_16d4f7d636df336db11d87413e3 
   CONSTRAINT     f   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "PK_16d4f7d636df336db11d87413e3";
       public            admin    false    230            �           2606    24601 $   Games PK_1950492f583d31609c5e9fbbe12 
   CONSTRAINT     f   ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "PK_1950492f583d31609c5e9fbbe12" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."Games" DROP CONSTRAINT "PK_1950492f583d31609c5e9fbbe12";
       public            admin    false    220                       2606    24577 ,   UserRelations PK_257286eb3db4e4571631f9119ba 
   CONSTRAINT     �   ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "PK_257286eb3db4e4571631f9119ba" PRIMARY KEY (sender_id, receptor_id);
 Z   ALTER TABLE ONLY public."UserRelations" DROP CONSTRAINT "PK_257286eb3db4e4571631f9119ba";
       public            admin    false    229    229                        2606    24581 +   MatchPlayers PK_286edaeb823ead963cf1362025d 
   CONSTRAINT     |   ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "PK_286edaeb823ead963cf1362025d" PRIMARY KEY (match_id, user_id);
 Y   ALTER TABLE ONLY public."MatchPlayers" DROP CONSTRAINT "PK_286edaeb823ead963cf1362025d";
       public            admin    false    224    224            �           2606    24583 .   ChannelMessages PK_65cc0346c694771b2331fa9d886 
   CONSTRAINT     p   ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "PK_65cc0346c694771b2331fa9d886" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public."ChannelMessages" DROP CONSTRAINT "PK_65cc0346c694771b2331fa9d886";
       public            admin    false    216            �           2606    24585 '   Channels PK_83bfface067961674514999d774 
   CONSTRAINT     i   ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "PK_83bfface067961674514999d774" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public."Channels" DROP CONSTRAINT "PK_83bfface067961674514999d774";
       public            admin    false    218            �           2606    24595 *   MatchEvents PK_a0647ec1249948e19a7e84ba060 
   CONSTRAINT     l   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "PK_a0647ec1249948e19a7e84ba060" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "PK_a0647ec1249948e19a7e84ba060";
       public            admin    false    222                       2606    24599 &   Matches PK_ccbc29936f1b1c20729917b2c1a 
   CONSTRAINT     h   ALTER TABLE ONLY public."Matches"
    ADD CONSTRAINT "PK_ccbc29936f1b1c20729917b2c1a" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."Matches" DROP CONSTRAINT "PK_ccbc29936f1b1c20729917b2c1a";
       public            admin    false    225            �           2606    24579 -   ChannelMembers PK_e00164a3679002ec6e4e4c4c4df 
   CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "PK_e00164a3679002ec6e4e4c4c4df" PRIMARY KEY (channel_id, user_id);
 [   ALTER TABLE ONLY public."ChannelMembers" DROP CONSTRAINT "PK_e00164a3679002ec6e4e4c4c4df";
       public            admin    false    215    215                       2606    24587 +   UserMessages PK_e1df899f8f652d3825397216139 
   CONSTRAINT     m   ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "PK_e1df899f8f652d3825397216139" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public."UserMessages" DROP CONSTRAINT "PK_e1df899f8f652d3825397216139";
       public            admin    false    227            
           2606    24591 $   Users UQ_03599a389e75563b8314f74278b 
   CONSTRAINT     d   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "UQ_03599a389e75563b8314f74278b" UNIQUE (login);
 R   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "UQ_03599a389e75563b8314f74278b";
       public            admin    false    230            �           2606    24597 *   MatchEvents UQ_1d4c1d9bffd7fc04f14c04f1b13 
   CONSTRAINT     m   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "UQ_1d4c1d9bffd7fc04f14c04f1b13" UNIQUE (match_id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "UQ_1d4c1d9bffd7fc04f14c04f1b13";
       public            admin    false    222                       2606    24593 $   Users UQ_5da3f86a40ce07289424c734c98 
   CONSTRAINT     g   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "UQ_5da3f86a40ce07289424c734c98" UNIQUE (nickname);
 R   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "UQ_5da3f86a40ce07289424c734c98";
       public            admin    false    230            �           1259    24602    IDX_3c6db54f906430893bb1f6e530    INDEX     c   CREATE INDEX "IDX_3c6db54f906430893bb1f6e530" ON public."ChannelMembers" USING btree (channel_id);
 4   DROP INDEX public."IDX_3c6db54f906430893bb1f6e530";
       public            admin    false    215            �           1259    24604    IDX_9c5abeee0fd9cf5a74f428aa1d    INDEX     _   CREATE INDEX "IDX_9c5abeee0fd9cf5a74f428aa1d" ON public."MatchPlayers" USING btree (match_id);
 4   DROP INDEX public."IDX_9c5abeee0fd9cf5a74f428aa1d";
       public            admin    false    224            �           1259    24603    IDX_ce263353a14add85c3832f0152    INDEX     `   CREATE INDEX "IDX_ce263353a14add85c3832f0152" ON public."ChannelMembers" USING btree (user_id);
 4   DROP INDEX public."IDX_ce263353a14add85c3832f0152";
       public            admin    false    215            �           1259    24605    IDX_f7c98da6be60b6d89e739ce1dc    INDEX     ^   CREATE INDEX "IDX_f7c98da6be60b6d89e739ce1dc" ON public."MatchPlayers" USING btree (user_id);
 4   DROP INDEX public."IDX_f7c98da6be60b6d89e739ce1dc";
       public            admin    false    224                       2606    24626 ,   UserRelations FK_179f312ee972f6bdd6ee1b81816    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "FK_179f312ee972f6bdd6ee1b81816" FOREIGN KEY (sender_id) REFERENCES public."Users"(id);
 Z   ALTER TABLE ONLY public."UserRelations" DROP CONSTRAINT "FK_179f312ee972f6bdd6ee1b81816";
       public          admin    false    3336    229    230                       2606    24636 *   MatchEvents FK_1d4c1d9bffd7fc04f14c04f1b13    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "FK_1d4c1d9bffd7fc04f14c04f1b13" FOREIGN KEY (match_id) REFERENCES public."Matches"(id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "FK_1d4c1d9bffd7fc04f14c04f1b13";
       public          admin    false    225    3330    222                       2606    24651 -   ChannelMembers FK_3c6db54f906430893bb1f6e5303    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "FK_3c6db54f906430893bb1f6e5303" FOREIGN KEY (channel_id) REFERENCES public."Channels"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 [   ALTER TABLE ONLY public."ChannelMembers" DROP CONSTRAINT "FK_3c6db54f906430893bb1f6e5303";
       public          admin    false    3318    215    218                       2606    24631 ,   UserRelations FK_4c0370dc9f07872c6378e3db016    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserRelations"
    ADD CONSTRAINT "FK_4c0370dc9f07872c6378e3db016" FOREIGN KEY (receptor_id) REFERENCES public."Users"(id);
 Z   ALTER TABLE ONLY public."UserRelations" DROP CONSTRAINT "FK_4c0370dc9f07872c6378e3db016";
       public          admin    false    229    230    3336                       2606    24611 .   ChannelMessages FK_96c3fe4ad9f9a49c881bda45345    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "FK_96c3fe4ad9f9a49c881bda45345" FOREIGN KEY (channel_id) REFERENCES public."Channels"(id);
 \   ALTER TABLE ONLY public."ChannelMessages" DROP CONSTRAINT "FK_96c3fe4ad9f9a49c881bda45345";
       public          admin    false    3318    218    216                       2606    24646 &   Matches FK_9769d116360684a526f92e15c06    FK CONSTRAINT     �   ALTER TABLE ONLY public."Matches"
    ADD CONSTRAINT "FK_9769d116360684a526f92e15c06" FOREIGN KEY (game_id) REFERENCES public."Games"(id);
 T   ALTER TABLE ONLY public."Matches" DROP CONSTRAINT "FK_9769d116360684a526f92e15c06";
       public          admin    false    3320    225    220                       2606    24641 *   MatchEvents FK_990f186e25c053d0a5b9d03f437    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchEvents"
    ADD CONSTRAINT "FK_990f186e25c053d0a5b9d03f437" FOREIGN KEY (initiator_id) REFERENCES public."Users"(id);
 X   ALTER TABLE ONLY public."MatchEvents" DROP CONSTRAINT "FK_990f186e25c053d0a5b9d03f437";
       public          admin    false    222    230    3336                       2606    24661 +   MatchPlayers FK_9c5abeee0fd9cf5a74f428aa1de    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "FK_9c5abeee0fd9cf5a74f428aa1de" FOREIGN KEY (match_id) REFERENCES public."Matches"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."MatchPlayers" DROP CONSTRAINT "FK_9c5abeee0fd9cf5a74f428aa1de";
       public          admin    false    224    225    3330                       2606    24621 +   UserMessages FK_bcb38d35921461e2a18dc32fab9    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "FK_bcb38d35921461e2a18dc32fab9" FOREIGN KEY (receiver_id) REFERENCES public."Users"(id);
 Y   ALTER TABLE ONLY public."UserMessages" DROP CONSTRAINT "FK_bcb38d35921461e2a18dc32fab9";
       public          admin    false    227    230    3336                       2606    24616 +   UserMessages FK_cd0815bc4e03939740fc9c39e34    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserMessages"
    ADD CONSTRAINT "FK_cd0815bc4e03939740fc9c39e34" FOREIGN KEY (sender_id) REFERENCES public."Users"(id);
 Y   ALTER TABLE ONLY public."UserMessages" DROP CONSTRAINT "FK_cd0815bc4e03939740fc9c39e34";
       public          admin    false    227    3336    230                       2606    24656 -   ChannelMembers FK_ce263353a14add85c3832f0152a    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMembers"
    ADD CONSTRAINT "FK_ce263353a14add85c3832f0152a" FOREIGN KEY (user_id) REFERENCES public."Users"(id);
 [   ALTER TABLE ONLY public."ChannelMembers" DROP CONSTRAINT "FK_ce263353a14add85c3832f0152a";
       public          admin    false    215    230    3336                       2606    24606 .   ChannelMessages FK_f712563554a2af0aab0b43d2304    FK CONSTRAINT     �   ALTER TABLE ONLY public."ChannelMessages"
    ADD CONSTRAINT "FK_f712563554a2af0aab0b43d2304" FOREIGN KEY (user_id) REFERENCES public."Users"(id);
 \   ALTER TABLE ONLY public."ChannelMessages" DROP CONSTRAINT "FK_f712563554a2af0aab0b43d2304";
       public          admin    false    230    216    3336                       2606    24666 +   MatchPlayers FK_f7c98da6be60b6d89e739ce1dcf    FK CONSTRAINT     �   ALTER TABLE ONLY public."MatchPlayers"
    ADD CONSTRAINT "FK_f7c98da6be60b6d89e739ce1dcf" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public."MatchPlayers" DROP CONSTRAINT "FK_f7c98da6be60b6d89e739ce1dcf";
       public          admin    false    230    3336    224           