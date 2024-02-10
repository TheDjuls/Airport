-- DROP FUNCTION public.getsucursalesandmodulosbyusuario();

CREATE OR REPLACE FUNCTION getsucursalesandmodulosbyusuario(pidusuario integer)
RETURNS TABLE (
  resultado1 json,
  resultado2 json
) AS $$
DECLARE
  json1 json;
  json2 json;
BEGIN
  -- Realiza la lógica para obtener el primer JSON
 select json_agg(m.idmodulo) INTO json1 from usuarios_modulos um , modulos m where um.idmodulo = m.idmodulo and um.idusuario =pidusuario;


  -- Realiza la lógica para obtener el segundo JSON
  select json_agg(s.idsucursal) INTO json2 from usuarios_sucursales us, sucursales s where us.idsucursal = s.idsucursal and us.idusuario =pidusuario;

  -- Devuelve los resultados
  RETURN QUERY SELECT json1, json2;
END;
$$ LANGUAGE plpgsql;
;
