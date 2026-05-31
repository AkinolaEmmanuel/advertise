-- Run in Supabase SQL Editor if your database still has open INSERT policies.

DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert analytic events" ON analytic_events;
