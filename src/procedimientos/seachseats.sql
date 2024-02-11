-- DROP FUNCTION public.searchseats(int4, int4);

CREATE OR REPLACE FUNCTION public.searchseats(pidavion integer, pidtipo integer)
 RETURNS TABLE(resultado1 json)
 LANGUAGE plpgsql
AS $function$
DECLARE
  json1 json;
BEGIN

SELECT json_agg(
          json_build_object(
            'asiento', a.*, 
            'ocupado', (select COUNT(*) as ocupado from ordenes_asientos oa, ordenes o  where oa."idOrden" = o.id and 
            o."fechafinalizacion" is null
            and 
            oa."idAsiento" = a.id )
          )
       ) into json1
from asientos a  where a."idAvion" = pidavion and a."idTipoAsiento" =pidtipo;


  -- Devuelve los resultados
  RETURN QUERY SELECT json1;
END;
$function$
;
