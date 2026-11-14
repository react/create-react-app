-- The person who hands the car over and takes it back.
--
-- The panel had five roles and none of them was the one job most of the
-- staff actually do. A driver was given a Staff login, which can see
-- bookings and create them but cannot complete a handover -- the pickup and
-- return forms both guard on booking.complete -- so the handover was done by
-- somebody in the office after the fact, from what the driver said on the
-- phone. The odometer and the photographs are worth more taken at the car.
--
-- Abilities come from the defaults in src/abilities.php, the same way every
-- other role's do; this only makes the role exist to assign.
INSERT INTO roles (slug, name, description) VALUES
  ('driver', 'Driver', 'Handovers and returns: the bookings of the day, and the inspection at the car')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);
