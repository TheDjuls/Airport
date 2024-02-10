CREATE OR REPLACE FUNCTION public.getmenu(pidsucursal INTEGER)
  RETURNS TABLE (idmenu INTEGER, nombre VARCHAR(50))
  LANGUAGE sql
AS $function$
  SELECT m.idmenu, m.nombre
  FROM public.menus m, public.productos_sucursales p
  WHERE p.idmenu = m.idmenu and p.idsucursal = pidsucursal 
  GROUP BY m.idmenu, m.nombre
 order by m.orden;
$function$;;
