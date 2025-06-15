ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to select their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Allow authenticated users and admin to insert roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users and admin to update roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated 
USING (auth.role() = 'admin' OR (SELECT auth.uid()) = user_id) 
WITH CHECK (auth.role() = 'admin' OR (SELECT auth.uid()) = user_id);

CREATE POLICY "Allow authenticated users and admin to delete roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated 
USING (auth.role() = 'admin' OR (SELECT auth.uid()) = user_id);