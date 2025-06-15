-- not in use, check v2

create or replace function public.insert_user_role () RETURNS trigger as $$
DECLARE
    user_role text;
BEGIN
    -- Check the value of the "signup_as" property in raw_user_meta_data
    IF NEW.raw_user_meta_data::jsonb ? 'signup_as' THEN
        user_role := NEW.raw_user_meta_data::jsonb->>'signup_as';
    ELSE
        user_role := 'undefined'; -- default
    END IF;

    -- Insert the user role into the user_roles table
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger after_user_signup
after INSERT on auth.users for EACH row
execute FUNCTION public.insert_user_role ();