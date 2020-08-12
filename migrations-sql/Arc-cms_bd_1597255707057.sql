DROP TABLE IF EXISTS public.table1 cascade;
CREATE TABLE IF NOT EXISTS public.table1( id VARCHAR(60) NOT NULL, code VARCHAR(50) NOT NULL, date_added TIMESTAMP NOT NULL DEFAULT 'now()', date_updated TIMESTAMP NOT NULL DEFAULT 'now()', intitule VARCHAR(100) NOT NULL, description VARCHAR(300) NULL, priorite INTEGER NOT NULL DEFAULT 10, activated BOOLEAN NOT NULL DEFAULT true );
ALTER TABLE public.table1 ADD CONSTRAINT publicTable1_PK PRIMARY KEY (id);
ALTER TABLE public.table1 ADD CONSTRAINT publicTable1_unique_id_1 UNIQUE (id);
ALTER TABLE public.table1 ADD CONSTRAINT publicTable1_unique_code_2 UNIQUE (code);