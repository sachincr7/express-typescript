CREATE TABLE "shopify_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"shop" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"isonline" boolean NOT NULL,
	"scope" varchar(255),
	"expires" integer,
	"onlineaccessinfo" varchar(255),
	"accesstoken" varchar(255)
);
