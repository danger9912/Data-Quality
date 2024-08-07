PGDMP  '            	        |            dataquality    16.1    16.1                 0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    17642    dataquality    DATABASE     ~   CREATE DATABASE dataquality WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE dataquality;
                postgres    false            �            1259    17660    comission_logs    TABLE     �   CREATE TABLE public.comission_logs (
    file_name character varying,
    field_names character varying,
    comission_rate character varying,
    checked_on timestamp without time zone,
    comission_log integer NOT NULL
);
 "   DROP TABLE public.comission_logs;
       public         heap    postgres    false            �            1259    17659     comission_logs_comission_log_seq    SEQUENCE     �   CREATE SEQUENCE public.comission_logs_comission_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.comission_logs_comission_log_seq;
       public          postgres    false    220                       0    0     comission_logs_comission_log_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.comission_logs_comission_log_seq OWNED BY public.comission_logs.comission_log;
          public          postgres    false    219            �            1259    17675    domain_logs    TABLE     �   CREATE TABLE public.domain_logs (
    domain_log_id integer NOT NULL,
    filename character varying(255),
    tested_date date,
    tested_result character varying(50)
);
    DROP TABLE public.domain_logs;
       public         heap    postgres    false            �            1259    17674    domain_logs_domain_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.domain_logs_domain_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.domain_logs_domain_log_id_seq;
       public          postgres    false    222            	           0    0    domain_logs_domain_log_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.domain_logs_domain_log_id_seq OWNED BY public.domain_logs.domain_log_id;
          public          postgres    false    221            �            1259    17653    format_consistency    TABLE     �   CREATE TABLE public.format_consistency (
    format_id integer NOT NULL,
    file_format character varying(255),
    max_size double precision,
    file_size_type character varying
);
 &   DROP TABLE public.format_consistency;
       public         heap    postgres    false            �            1259    17652     format_consistency_format_id_seq    SEQUENCE     �   CREATE SEQUENCE public.format_consistency_format_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.format_consistency_format_id_seq;
       public          postgres    false    218            
           0    0     format_consistency_format_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.format_consistency_format_id_seq OWNED BY public.format_consistency.format_id;
          public          postgres    false    217            �            1259    17643    omission_logs    TABLE     �   CREATE TABLE public.omission_logs (
    file_name character varying,
    field_names character varying,
    omission_rate character varying,
    checked_on timestamp without time zone,
    omission_log_id integer NOT NULL
);
 !   DROP TABLE public.omission_logs;
       public         heap    postgres    false            �            1259    17648 !   omission_logs_omission_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.omission_logs_omission_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.omission_logs_omission_log_id_seq;
       public          postgres    false    215                       0    0 !   omission_logs_omission_log_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.omission_logs_omission_log_id_seq OWNED BY public.omission_logs.omission_log_id;
          public          postgres    false    216            a           2604    17663    comission_logs comission_log    DEFAULT     �   ALTER TABLE ONLY public.comission_logs ALTER COLUMN comission_log SET DEFAULT nextval('public.comission_logs_comission_log_seq'::regclass);
 K   ALTER TABLE public.comission_logs ALTER COLUMN comission_log DROP DEFAULT;
       public          postgres    false    220    219    220            b           2604    17678    domain_logs domain_log_id    DEFAULT     �   ALTER TABLE ONLY public.domain_logs ALTER COLUMN domain_log_id SET DEFAULT nextval('public.domain_logs_domain_log_id_seq'::regclass);
 H   ALTER TABLE public.domain_logs ALTER COLUMN domain_log_id DROP DEFAULT;
       public          postgres    false    222    221    222            `           2604    17656    format_consistency format_id    DEFAULT     �   ALTER TABLE ONLY public.format_consistency ALTER COLUMN format_id SET DEFAULT nextval('public.format_consistency_format_id_seq'::regclass);
 K   ALTER TABLE public.format_consistency ALTER COLUMN format_id DROP DEFAULT;
       public          postgres    false    217    218    218            _           2604    17649    omission_logs omission_log_id    DEFAULT     �   ALTER TABLE ONLY public.omission_logs ALTER COLUMN omission_log_id SET DEFAULT nextval('public.omission_logs_omission_log_id_seq'::regclass);
 L   ALTER TABLE public.omission_logs ALTER COLUMN omission_log_id DROP DEFAULT;
       public          postgres    false    216    215            �          0    17660    comission_logs 
   TABLE DATA           k   COPY public.comission_logs (file_name, field_names, comission_rate, checked_on, comission_log) FROM stdin;
    public          postgres    false    220   :&                 0    17675    domain_logs 
   TABLE DATA           Z   COPY public.domain_logs (domain_log_id, filename, tested_date, tested_result) FROM stdin;
    public          postgres    false    222   �&       �          0    17653    format_consistency 
   TABLE DATA           ^   COPY public.format_consistency (format_id, file_format, max_size, file_size_type) FROM stdin;
    public          postgres    false    218   �'       �          0    17643    omission_logs 
   TABLE DATA           k   COPY public.omission_logs (file_name, field_names, omission_rate, checked_on, omission_log_id) FROM stdin;
    public          postgres    false    215   (                  0    0     comission_logs_comission_log_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.comission_logs_comission_log_seq', 18, true);
          public          postgres    false    219                       0    0    domain_logs_domain_log_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.domain_logs_domain_log_id_seq', 34, true);
          public          postgres    false    221                       0    0     format_consistency_format_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.format_consistency_format_id_seq', 41, true);
          public          postgres    false    217                       0    0 !   omission_logs_omission_log_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.omission_logs_omission_log_id_seq', 123, true);
          public          postgres    false    216            h           2606    17667 "   comission_logs comission_logs_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.comission_logs
    ADD CONSTRAINT comission_logs_pkey PRIMARY KEY (comission_log);
 L   ALTER TABLE ONLY public.comission_logs DROP CONSTRAINT comission_logs_pkey;
       public            postgres    false    220            j           2606    17682    domain_logs domain_logs_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.domain_logs
    ADD CONSTRAINT domain_logs_pkey PRIMARY KEY (domain_log_id);
 F   ALTER TABLE ONLY public.domain_logs DROP CONSTRAINT domain_logs_pkey;
       public            postgres    false    222            f           2606    17658 *   format_consistency format_consistency_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.format_consistency
    ADD CONSTRAINT format_consistency_pkey PRIMARY KEY (format_id);
 T   ALTER TABLE ONLY public.format_consistency DROP CONSTRAINT format_consistency_pkey;
       public            postgres    false    218            d           2606    17651     omission_logs omission_logs_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.omission_logs
    ADD CONSTRAINT omission_logs_pkey PRIMARY KEY (omission_log_id);
 J   ALTER TABLE ONLY public.omission_logs DROP CONSTRAINT omission_logs_pkey;
       public            postgres    false    215            �   �   x���� ����`��~G�&"���b�C���%&�03�g��ʪaV�9����o!��
�|��Z>k��G�k�(���uH��x�)�.5Ǆ��"�e ��~qR}�A�ɜ'}�����#�J��8�&�         �   x����n� Eמ)�Ì"���J)�TN\9^��K�ʢ]�Fb	�;��#G�HgT5��9��Zn�嚷u��l�>m���}���_�.1 ��S9ӳ n 	��SP�A��?��-C��'�O�� ���ЀS�`ÞI~RX�՞>9�{C%�uă���D��}U�r��U,ƎG�A-��nJM���a�b!F��p;��%�����x|ܬjC
�r��gtIy���Z��2�9��~�[ �/�c)�      �   +   x�3����	��4��u�2���w	�470 �LAR�=... �*0      �   �   x��α
�0�y
���L��stBhO[�MI*�up�����H�����^�h��:�)0��%9Y����V��CW.˞�C�r��m�G�8���N�],��R�� �Z n)�d��Fc�D��Ӏ��!��b�F��3�����Փ�PVFפ2k-vR� �,U7     