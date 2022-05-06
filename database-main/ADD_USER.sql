INSERT INTO public."user"(username, password, first_name, last_name, phone, email)
	VALUES ('username', X'000000000000', 'Name', 'Name', 'phone', 'email');
	
UPDATE "order" SET user_id=15 WHERE user_id IS NULL;
SELECT * FROM "user";
