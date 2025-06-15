create or replace function public.insert_user_role () RETURNS trigger as $$
BEGIN
    -- Always insert the role "undefined" for new users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'undefined');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing trigger if it exists
drop trigger IF exists after_user_signup on auth.users;

-- Create the trigger to call the updated function
create trigger after_user_signup
after INSERT on auth.users for EACH row
execute FUNCTION public.insert_user_role ();