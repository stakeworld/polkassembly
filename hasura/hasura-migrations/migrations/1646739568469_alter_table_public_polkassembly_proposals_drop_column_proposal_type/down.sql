ALTER TABLE "public"."polkassembly_proposals" ADD COLUMN "proposal_type" text;
ALTER TABLE "public"."polkassembly_proposals" ALTER COLUMN "proposal_type" DROP NOT NULL;
