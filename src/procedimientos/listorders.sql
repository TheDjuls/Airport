-- DROP FUNCTION public.listorders();

-- DROP FUNCTION public.listorders(int4);

CREATE OR REPLACE FUNCTION public.listorders(pidusuario integer)
 RETURNS TABLE(resultado1 json)
 LANGUAGE plpgsql
AS $function$
DECLARE
  json1 json;
BEGIN


select
	json_agg(json_build_object(
	'horaSalida', (select v."horaSalida" from vuelos v, ordenes o2 where o2."idVuelo" = v.id  and o2.id = o.id ),
            'orden',
	o.*,
	'vigente',
	case
		when extract(EPOCH
	from
		(NOW() at TIME zone 'America/Mexico_City' - o."fechaOrden" )) / 60 > 30 then false
		else true
	end ,
	'asientos',
	(
	select
		array_to_string(array_agg(a."numeroAsiento"),
		',') as valores_agrupados
	from
		ordenes_asientos oa,
		asientos a
	where
		oa."idAsiento" = a.id
		and oa."idOrden" = o.id)
          ))
into
	json1
from
	ordenes o
where
	o."idUsuario" = pidusuario; 

  -- Devuelve los resultados
  RETURN QUERY SELECT json1;
END;
$function$
;
;
