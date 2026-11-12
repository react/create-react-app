-- Where a booking came from, who took it, and when the car actually left.
--
-- Until now every booking looked the same once it was in the table: somebody
-- typed it into the panel. A customer who walks up to a driver and takes a
-- car twenty minutes later is a different thing from one who rang the office
-- a fortnight ago, and the business wants to know which is which -- how much
-- of the trade is walk-in, which driver is bringing it in, and whether the
-- car left when the booking said it would.
--
-- created_by already records which login wrote the row. That is not the same
-- as the driver: the office can create a booking for a driver to hand over,
-- and a driver can create one for a car somebody else will hand back.
ALTER TABLE bookings
  -- Admin, Website, Walk-in. Walk-in is the one a driver starts at the car
  -- with no booking in front of it. VARCHAR rather than ENUM so adding a
  -- fourth source later is not a table rebuild.
  ADD COLUMN source     VARCHAR(16)  NOT NULL DEFAULT 'Admin' AFTER status,

  -- The driver who handed the car over, when it was handed over by one.
  ADD COLUMN driver_id  INT UNSIGNED NULL AFTER created_by,

  -- When the car actually left, as against start_at, which is when it was
  -- meant to. A hire that began two hours late reads honestly in the reports
  -- rather than looking punctual.
  ADD COLUMN started_at DATETIME     NULL AFTER return_at;

-- Existing rows predate the walk-in flow, so they came from the panel.
UPDATE bookings SET source = 'Admin' WHERE source = '' OR source IS NULL;

-- "Which walk-ins did this driver take this month" is a report somebody will
-- want, and without this it reads the whole table.
CREATE INDEX idx_bookings_source_driver ON bookings (source, driver_id);
