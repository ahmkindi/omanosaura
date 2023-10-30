-- name: InsertUserRequest :exec
INSERT INTO user_requests (email, start_date, created_at, num_of_participants, include_equipment, include_car, include_guide, luxury_rating)
VALUES ($1, $2, CURRENT_TIME, $4, $5, $6, $7);

-- name: InsertUserRequestTrips :copyfrom
INSERT INTO user_request_trips (user_request_id, custom_trip_id)
VALUES ($1, $2);
