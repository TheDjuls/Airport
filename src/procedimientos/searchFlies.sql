-- DROP FUNCTION public.searchflies();


CREATE OR REPLACE FUNCTION public.searchflies(pfecha date,pidAerolinea integer, pidOrigen integer, pidDestino integer)
 RETURNS TABLE(resultado1 json)
 LANGUAGE plpgsql
AS $function$
DECLARE
  json1 json;
BEGIN

SELECT json_agg(
          json_build_object(
            'vuelo', v.*, 
            'aerolinea', a.*, 
            'aeropuertoOrigen', a2.*, 
            'aeropuertoDestino', a3.*, 
            'avion', a4.*
          )
       ) into json1
FROM vuelos v 
INNER JOIN aerolineas a ON v."idAerolinea" = a.id 
INNER JOIN aeropuertos a2 ON v."idAeropuertoOrigen" = a2.id 
INNER JOIN aeropuertos a3 ON v."idAeropuertoDestino" = a3.id 
INNER JOIN aviones a4 ON v."idAvion" = a4.id
where v."horaSalida"::date = pfecha
and (pidAerolinea IS NULL OR a.id = pidAerolinea)
and (pidOrigen IS NULL OR a2.id = pidOrigen)
and (pidDestino IS NULL OR a3.id = pidDestino);
  -- Devuelve los resultados
  RETURN QUERY SELECT json1;
END;
$function$
;

