-- Remove anonymous write access; checkout now runs through the trusted server
DROP POLICY IF EXISTS "Anyone can create a customer record" ON public.customers;
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
DROP POLICY IF EXISTS "Anyone can add order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;

REVOKE INSERT, UPDATE, DELETE ON public.customers FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.reviews FROM anon;

GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.reviews TO service_role;

-- Restrict SECURITY DEFINER helpers so they are not callable from the API roles
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;