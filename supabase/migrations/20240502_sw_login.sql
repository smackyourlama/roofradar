ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS service_worker_username TEXT;

CREATE OR REPLACE FUNCTION set_service_worker_credentials(p_tenant_id UUID, p_username TEXT, p_password TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.tenant_memberships WHERE tenant_id = p_tenant_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  INSERT INTO public.platform_settings (tenant_id, service_worker_username, service_worker_password)
  VALUES (p_tenant_id, p_username, crypt(p_password, gen_salt('bf')))
  ON CONFLICT (tenant_id) 
  DO UPDATE SET service_worker_username = p_username, service_worker_password = crypt(p_password, gen_salt('bf')), updated_at = NOW();
END;
$$;
