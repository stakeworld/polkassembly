ALTER TABLE "public"."polkassembly_proposals" ADD COLUMN "author_id" int4;
ALTER TABLE "public"."polkassembly_proposals" ALTER COLUMN "author_id" DROP NOT NULL;
