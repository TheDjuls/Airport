-- DROP FUNCTION public.searchvuelobyid(int4);

CREATE OR REPLACE FUNCTION public.searchvuelobyid(pidvuelo integer)
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
where v.id = pidvuelo;
  -- Devuelve los resultados
  RETURN QUERY SELECT json1;
END;
$function$
;
