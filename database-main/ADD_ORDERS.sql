INSERT INTO public."order"(user_id, restaurant_id, status, ready_time)
	VALUES
		(15, 3, 'STATUS', NOW()),
		(15, 3, 'STATUS', NOW()),
		(9, 3, 'STATUS', NOW()),
		(9, 3, 'STATUS', NOW());
		
SELECT * FROM "order";
--TRUNCATE "order" RESTART IDENTITY CASCADE;
--UPDATE "order" SET user_id=11 WHERE user_id IS NULL;
