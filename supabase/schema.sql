


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."currency_code" AS ENUM (
    'USD',
    'GBP',
    'EUR'
);


ALTER TYPE "public"."currency_code" OWNER TO "postgres";


CREATE TYPE "public"."notify_channel" AS ENUM (
    'email',
    'app',
    'both'
);


ALTER TYPE "public"."notify_channel" OWNER TO "postgres";


CREATE TYPE "public"."participant_status" AS ENUM (
    'invited',
    'accepted',
    'declined',
    'left'
);


ALTER TYPE "public"."participant_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_current_timestamp_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_event_participants_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now(); return new;
end$$;


ALTER FUNCTION "public"."set_event_participants_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_events_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now(); return new;
end$$;


ALTER FUNCTION "public"."set_events_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_profiles_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now(); return new;
end$$;


ALTER FUNCTION "public"."set_profiles_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at := now();
  return new;
end $$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."currency_rates" (
    "code" "text" NOT NULL,
    "name" "text",
    "rate" numeric NOT NULL,
    "base" "text" DEFAULT 'USD'::"text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "currency_rates_base_check" CHECK (("char_length"("base") = 3)),
    CONSTRAINT "currency_rates_code_check" CHECK (("char_length"("code") = 3)),
    CONSTRAINT "currency_rates_rate_check" CHECK (("rate" > (0)::numeric))
);


ALTER TABLE "public"."currency_rates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "token" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."event_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "email" "text",
    "display_name" "text",
    "status" "text" DEFAULT 'invited'::"text" NOT NULL,
    "budget_override_usd_cents" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "event_participants_budget_nonneg_chk" CHECK ((("budget_override_usd_cents" IS NULL) OR ("budget_override_usd_cents" >= 0))),
    CONSTRAINT "event_participants_identity_chk" CHECK ((("user_id" IS NOT NULL) OR ("email" IS NOT NULL))),
    CONSTRAINT "event_participants_status_check" CHECK (("status" = ANY (ARRAY['invited'::"text", 'accepted'::"text", 'declined'::"text"])))
);


ALTER TABLE "public"."event_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_types" (
    "id" integer NOT NULL,
    "code" "text" NOT NULL,
    "label" "text" NOT NULL,
    "has_draw" boolean DEFAULT false NOT NULL,
    "defaults" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "public"."event_types" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."event_types_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."event_types_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."event_types_id_seq" OWNED BY "public"."event_types"."id";



CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "event_date" "date" NOT NULL,
    "event_type" "text" DEFAULT 'other'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_shared" boolean DEFAULT false NOT NULL,
    "budget_usd_cents" bigint,
    "budget_input_currency" "public"."currency_code",
    "recurrence" "text",
    "timezone" "text",
    "draw_deadline" timestamp with time zone,
    "active_round" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "events_event_type_check" CHECK (("event_type" = ANY (ARRAY['birthday'::"text", 'anniversary'::"text", 'holiday'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "dob" "date",
    "relationship" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."friends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fx_rates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "fetched_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "base" "public"."currency_code" DEFAULT 'USD'::"public"."currency_code" NOT NULL,
    "quote" "public"."currency_code" NOT NULL,
    "rate" numeric(18,8) NOT NULL
);


ALTER TABLE "public"."fx_rates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "dob" "date",
    "show_dob_year" boolean DEFAULT false,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" "text",
    "hide_birth_year" boolean DEFAULT true NOT NULL,
    "fb_picture_url" "text",
    "fb_id" "text",
    "fb_last_sync" timestamp with time zone,
    "permissions_granted" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "interests" "text"[] DEFAULT '{}'::"text"[],
    "preferred_shops" "text"[] DEFAULT '{}'::"text"[],
    "banner_url" "text",
    "preferred_currency" "public"."currency_code" DEFAULT 'USD'::"public"."currency_code" NOT NULL,
    "notify_channel" "public"."notify_channel" DEFAULT 'both'::"public"."notify_channel" NOT NULL,
    "categories" "text"[] DEFAULT '{}'::"text"[],
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "notify_mobile" boolean,
    "notify_email" boolean,
    "unsubscribe_all" boolean
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."profiles_public" AS
 SELECT "id",
    "full_name",
    "email",
        CASE
            WHEN ("dob" IS NULL) THEN NULL::"text"
            WHEN "hide_birth_year" THEN "to_char"(("dob")::timestamp with time zone, 'DD Mon'::"text")
            ELSE "to_char"(("dob")::timestamp with time zone, 'DD Mon YYYY'::"text")
        END AS "birthday_display",
    "fb_picture_url",
    "interests",
    "preferred_shops"
   FROM "public"."profiles";


ALTER VIEW "public"."profiles_public" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."secret_santa_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "round" smallint NOT NULL,
    "giver_user_id" "uuid",
    "giver_email" "text",
    "receiver_user_id" "uuid",
    "receiver_email" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ssa_giver_identity_chk" CHECK ((("giver_user_id" IS NOT NULL) OR ("giver_email" IS NOT NULL))),
    CONSTRAINT "ssa_receiver_identity_chk" CHECK ((("receiver_user_id" IS NOT NULL) OR ("receiver_email" IS NOT NULL)))
);


ALTER TABLE "public"."secret_santa_assignments" OWNER TO "postgres";


ALTER TABLE ONLY "public"."event_types" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."event_types_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."currency_rates"
    ADD CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("code");



ALTER TABLE ONLY "public"."event_invites"
    ADD CONSTRAINT "event_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_invites"
    ADD CONSTRAINT "event_invites_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_unique_event_user" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_types"
    ADD CONSTRAINT "event_types_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."event_types"
    ADD CONSTRAINT "event_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fx_rates"
    ADD CONSTRAINT "fx_rates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."secret_santa_assignments"
    ADD CONSTRAINT "secret_santa_assignments_pkey" PRIMARY KEY ("id");



CREATE INDEX "currency_rates_updated_at_idx" ON "public"."currency_rates" USING "btree" ("updated_at" DESC);



CREATE INDEX "event_participants_event_idx" ON "public"."event_participants" USING "btree" ("event_id");



CREATE UNIQUE INDEX "event_participants_unique_email" ON "public"."event_participants" USING "btree" ("event_id", "lower"("email")) WHERE ("email" IS NOT NULL);



CREATE UNIQUE INDEX "event_participants_unique_event_email_ci" ON "public"."event_participants" USING "btree" ("event_id", "lower"("email")) WHERE ("email" IS NOT NULL);



CREATE UNIQUE INDEX "event_participants_unique_user" ON "public"."event_participants" USING "btree" ("event_id", "user_id") WHERE ("user_id" IS NOT NULL);



CREATE INDEX "event_participants_user_idx" ON "public"."event_participants" USING "btree" ("user_id");



CREATE INDEX "events_owner_idx" ON "public"."events" USING "btree" ("user_id");



CREATE UNIQUE INDEX "fx_rates_unique_snapshot" ON "public"."fx_rates" USING "btree" ("base", "quote", "fetched_at");



CREATE INDEX "ssa_event_round_idx" ON "public"."secret_santa_assignments" USING "btree" ("event_id", "round");



CREATE UNIQUE INDEX "ssa_unique_giver_email" ON "public"."secret_santa_assignments" USING "btree" ("event_id", "round", "lower"("giver_email")) WHERE ("giver_email" IS NOT NULL);



CREATE UNIQUE INDEX "ssa_unique_giver_per_round" ON "public"."secret_santa_assignments" USING "btree" ("event_id", "round", "giver_user_id");



CREATE UNIQUE INDEX "ssa_unique_giver_user" ON "public"."secret_santa_assignments" USING "btree" ("event_id", "round", "giver_user_id") WHERE ("giver_user_id" IS NOT NULL);



CREATE UNIQUE INDEX "ssa_unique_receiver_per_round" ON "public"."secret_santa_assignments" USING "btree" ("event_id", "round", "receiver_user_id");



CREATE OR REPLACE TRIGGER "set_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();



CREATE OR REPLACE TRIGGER "trg_event_participants_updated" BEFORE UPDATE ON "public"."event_participants" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_event_participants_updated_at" BEFORE UPDATE ON "public"."event_participants" FOR EACH ROW EXECUTE FUNCTION "public"."set_event_participants_updated_at"();



CREATE OR REPLACE TRIGGER "trg_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."set_events_updated_at"();



CREATE OR REPLACE TRIGGER "trg_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_profiles_updated_at"();



ALTER TABLE ONLY "public"."event_invites"
    ADD CONSTRAINT "event_invites_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_participants"
    ADD CONSTRAINT "event_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."secret_santa_assignments"
    ADD CONSTRAINT "secret_santa_assignments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."secret_santa_assignments"
    ADD CONSTRAINT "secret_santa_assignments_giver_user_id_fkey" FOREIGN KEY ("giver_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."secret_santa_assignments"
    ADD CONSTRAINT "secret_santa_assignments_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE "public"."currency_rates" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "currency_rates_select_all" ON "public"."currency_rates" FOR SELECT USING (true);



CREATE POLICY "currency_rates_write_service" ON "public"."currency_rates" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."event_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_participants" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "event_participants_owner_manage" ON "public"."event_participants" USING (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "event_participants"."event_id")))) WITH CHECK (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "event_participants"."event_id"))));



CREATE POLICY "event_participants_self_read" ON "public"."event_participants" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR ("lower"("email") = "lower"(COALESCE(("auth"."jwt"() ->> 'email'::"text"), ''::"text")))));



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "events owner read" ON "public"."events" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "events owner write" ON "public"."events" TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "events_delete_own" ON "public"."events" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "events_insert_own" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "events_owner_all" ON "public"."events" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "events_participant_read" ON "public"."events" FOR SELECT TO "authenticated" USING ((("is_shared" = true) AND (EXISTS ( SELECT 1
   FROM "public"."event_participants" "p"
  WHERE (("p"."event_id" = "events"."id") AND (("p"."user_id" = "auth"."uid"()) OR ("lower"("p"."email") = "lower"(COALESCE(("auth"."jwt"() ->> 'email'::"text"), ''::"text")))))))));



CREATE POLICY "events_select_own" ON "public"."events" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "events_shared_participant_read" ON "public"."events" FOR SELECT USING ((("is_shared" = true) AND (EXISTS ( SELECT 1
   FROM "public"."event_participants" "p"
  WHERE (("p"."event_id" = "events"."id") AND (("p"."user_id" = "auth"."uid"()) OR ("lower"("p"."email") = "lower"(COALESCE(("auth"."jwt"() ->> 'email'::"text"), ''::"text")))))))));



CREATE POLICY "events_update_own" ON "public"."events" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "friends owner read" ON "public"."friends" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "friends owner write" ON "public"."friends" TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."fx_rates" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fx_select_all_auth" ON "public"."fx_rates" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "fx_service_role_writes" ON "public"."fx_rates" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "invites_owner_all" ON "public"."event_invites" TO "authenticated" USING (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "event_invites"."event_id")))) WITH CHECK (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "event_invites"."event_id"))));



CREATE POLICY "invites_owner_manage" ON "public"."event_invites" USING ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_invites"."event_id") AND ("e"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_invites"."event_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "participants_owner_manage" ON "public"."event_participants" USING ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_participants"."event_id") AND ("e"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_participants"."event_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "participants_self_read" ON "public"."event_participants" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR ("lower"(COALESCE("email", ''::"text")) = "lower"(COALESCE(("auth"."jwt"() ->> 'email'::"text"), ''::"text")))));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles are readable by self" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles are updatable by self" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles owner select" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles owner update" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles owner upsert" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles-insert-own" ON "public"."profiles" FOR INSERT WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles-update-own" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles_owner_insert" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_owner_read" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_owner_select" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles_owner_update" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."secret_santa_assignments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "ssa_owner_read" ON "public"."secret_santa_assignments" FOR SELECT TO "authenticated" USING (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "secret_santa_assignments"."event_id"))));



CREATE POLICY "ssa_owner_select_all" ON "public"."secret_santa_assignments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "secret_santa_assignments"."event_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "ssa_owner_write" ON "public"."secret_santa_assignments" TO "authenticated" USING (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "secret_santa_assignments"."event_id")))) WITH CHECK (("auth"."uid"() = ( SELECT "e"."user_id"
   FROM "public"."events" "e"
  WHERE ("e"."id" = "secret_santa_assignments"."event_id"))));



CREATE POLICY "ssa_owner_writes" ON "public"."secret_santa_assignments" USING ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "secret_santa_assignments"."event_id") AND ("e"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "secret_santa_assignments"."event_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "ssa_participant_select_self" ON "public"."secret_santa_assignments" FOR SELECT USING (("giver_user_id" = "auth"."uid"()));



CREATE POLICY "ssa_participant_self_read" ON "public"."secret_santa_assignments" FOR SELECT TO "authenticated" USING ((("giver_user_id" = "auth"."uid"()) OR ("lower"("giver_email") = "lower"(COALESCE(("auth"."jwt"() ->> 'email'::"text"), ''::"text")))));



CREATE POLICY "update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"(character) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "anon";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"("inet") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "anon";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_current_timestamp_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_current_timestamp_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_current_timestamp_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_event_participants_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_event_participants_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_event_participants_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_events_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_events_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_events_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_profiles_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_profiles_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_profiles_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "service_role";












GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "service_role";









GRANT ALL ON TABLE "public"."currency_rates" TO "anon";
GRANT ALL ON TABLE "public"."currency_rates" TO "authenticated";
GRANT ALL ON TABLE "public"."currency_rates" TO "service_role";



GRANT ALL ON TABLE "public"."event_invites" TO "anon";
GRANT ALL ON TABLE "public"."event_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."event_invites" TO "service_role";



GRANT ALL ON TABLE "public"."event_participants" TO "anon";
GRANT ALL ON TABLE "public"."event_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."event_participants" TO "service_role";



GRANT ALL ON TABLE "public"."event_types" TO "anon";
GRANT ALL ON TABLE "public"."event_types" TO "authenticated";
GRANT ALL ON TABLE "public"."event_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."event_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."event_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."event_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";



GRANT ALL ON TABLE "public"."fx_rates" TO "anon";
GRANT ALL ON TABLE "public"."fx_rates" TO "authenticated";
GRANT ALL ON TABLE "public"."fx_rates" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."profiles_public" TO "anon";
GRANT ALL ON TABLE "public"."profiles_public" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles_public" TO "service_role";



GRANT ALL ON TABLE "public"."secret_santa_assignments" TO "anon";
GRANT ALL ON TABLE "public"."secret_santa_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."secret_santa_assignments" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
