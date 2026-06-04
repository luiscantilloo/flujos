/**
 * Estructura objetivo completa — repos frio-frontend y frio-backend (Bodega de Frío V2.0).
 * Fuente: documentación V2.0 §4, §6, §8; roles WMS; modelo dual 3NF + warehouse_state.
 * @typedef {{ id: string, name: string, hint?: string, children?: ArchNode[] }} ArchNode
 */

/** @type {ArchNode[]} */
export const FRONTEND_TREE = [
  { id: 'fe-env', name: '.env.example', hint: 'NEXT_PUBLIC_SUPABASE_*, NEST_API_URL, FRIDEM_*' },
  { id: 'fe-env-local', name: '.env.local', hint: 'Secretos locales (no commitear)' },
  { id: 'fe-next-config', name: 'next.config.ts', hint: 'Turbopack root, redirects, headers' },
  { id: 'fe-package', name: 'package.json', hint: 'Next 16, React 19, Supabase JS, Tailwind 4' },
  { id: 'fe-tsconfig', name: 'tsconfig.json', hint: 'Paths @/ → app, routes, components, lib' },
  {
    id: 'fe-middleware',
    name: 'middleware.ts',
    hint: 'Matcher + canAccessRoute() desde routes/routeGuards',
  },
  {
    id: 'fe-routes',
    name: 'routes/',
    hint: 'Registro de URLs y RBAC — app/ implementa las páginas; routes/ define paths y permisos',
    children: [
      { id: 'fe-routes-index', name: 'index.ts', hint: 'Re-export público del módulo routes' },
      {
        id: 'fe-routes-paths',
        name: 'paths.ts',
        hint: 'frioPaths: constantes URL (espejo de carpetas en app/)',
      },
      {
        id: 'fe-routes-config',
        name: 'routes.config.ts',
        hint: 'FRIO_ROUTE_REGISTRY: id, path, appSegment, roles, label',
      },
      {
        id: 'fe-routes-nav',
        name: 'navigationByRole.ts',
        hint: 'Sidebar por rol — href desde paths.ts',
      },
      {
        id: 'fe-routes-guards',
        name: 'routeGuards.ts',
        hint: 'isPublicPath, canAccessRoute, getDefaultPathForRole',
      },
      {
        id: 'fe-routes-match',
        name: 'matchRoute.ts',
        hint: 'Resuelve pathname → route def; helpers para Link y redirect',
      },
    ],
  },
  {
    id: 'fe-app',
    name: 'app/',
    hint: 'App Router — archivos page.tsx; URLs definidas en routes/paths.ts',
    children: [
      { id: 'fe-root-layout', name: 'layout.tsx', hint: 'Providers globales, fuentes, tema' },
      { id: 'fe-root-page', name: 'page.tsx', hint: 'Redirect según sesión → login o dashboard' },
      { id: 'fe-root-loading', name: 'loading.tsx', hint: 'Skeleton global' },
      { id: 'fe-root-error', name: 'error.tsx', hint: 'Error boundary raíz' },
      { id: 'fe-root-not-found', name: 'not-found.tsx', hint: '404 aplicación' },
      {
        id: 'fe-auth',
        name: '(auth)/',
        hint: 'Grupo sin dashboard — login V2',
        children: [
          { id: 'fe-auth-layout', name: 'layout.tsx', hint: 'Layout centrado, sin sidebar' },
          {
            id: 'fe-auth-login',
            name: 'login/',
            children: [
              { id: 'fe-auth-login-page', name: 'page.tsx', hint: 'Paso 1 codigoEmpresa → 2 usuario → 3 contraseña' },
              { id: 'fe-auth-login-loading', name: 'loading.tsx' },
            ],
          },
          {
            id: 'fe-auth-recover',
            name: 'recuperar/',
            children: [
              { id: 'fe-auth-recover-page', name: 'page.tsx', hint: 'Reset contraseña Supabase Auth' },
            ],
          },
          {
            id: 'fe-auth-plataforma',
            name: 'plataforma/',
            hint: 'Login configurador TI (sin codigoEmpresa cliente)',
            children: [
              { id: 'fe-auth-plat-page', name: 'page.tsx', hint: 'Correo + contraseña panel SaaS' },
            ],
          },
        ],
      },
      {
        id: 'fe-dash',
        name: '(dashboard)/',
        hint: 'Operación y configuración con sesión activa',
        children: [
          {
            id: 'fe-dash-layout',
            name: 'layout.tsx',
            hint: 'Sidebar por rol, selector bodega/tenant, AuthContext',
          },
          {
            id: 'fe-dash-home',
            name: 'page.tsx',
            hint: 'Dashboard dinámico multi-rol — cola operativa, KPIs resumen',
          },
          {
            id: 'fe-ingreso',
            name: 'ingreso/',
            hint: 'Recepción, OC, SOL, conciliación ciega',
            children: [
              { id: 'fe-ingreso-page', name: 'page.tsx', hint: 'Listado ingresos del día' },
              {
                id: 'fe-ingreso-recepcion',
                name: 'recepcion/',
                children: [
                  { id: 'fe-ingreso-rec-page', name: 'page.tsx', hint: 'Llegada camión, documentos, temperatura' },
                  { id: 'fe-ingreso-rec-id', name: '[ocId]/page.tsx', hint: 'Cierre recepción línea a línea vs OC' },
                ],
              },
              {
                id: 'fe-ingreso-oc',
                name: 'ordenes-compra/',
                children: [
                  { id: 'fe-ingreso-oc-list', name: 'page.tsx' },
                  { id: 'fe-ingreso-oc-new', name: 'nueva/page.tsx' },
                  { id: 'fe-ingreso-oc-detail', name: '[ocId]/page.tsx', hint: 'Estados OC, transporte, recepción' },
                ],
              },
              {
                id: 'fe-ingreso-sol',
                name: 'solicitudes-compra/',
                children: [
                  { id: 'fe-ingreso-sol-list', name: 'page.tsx' },
                  { id: 'fe-ingreso-sol-new', name: 'nueva/page.tsx' },
                  { id: 'fe-ingreso-sol-detail', name: '[solId]/page.tsx' },
                ],
              },
              {
                id: 'fe-ingreso-cajas',
                name: 'cajas/',
                children: [
                  { id: 'fe-ingreso-cajas-page', name: 'page.tsx', hint: 'Alta inboundBoxes, escaneo/QR' },
                ],
              },
            ],
          },
          {
            id: 'fe-mapa',
            name: 'mapa/',
            hint: 'Mapa slots, locking, cola operativa',
            children: [
              { id: 'fe-mapa-page', name: 'page.tsx', hint: 'SlotsGrid + alertas + órdenes abiertas' },
              {
                id: 'fe-mapa-cola',
                name: 'cola/',
                children: [
                  { id: 'fe-mapa-cola-page', name: 'page.tsx', hint: 'Órdenes de trabajo para operario' },
                  { id: 'fe-mapa-cola-ot', name: '[ordenId]/page.tsx', hint: 'Ejecutar movimiento, confirmar slot' },
                ],
              },
              {
                id: 'fe-mapa-slot',
                name: 'slot/',
                children: [{ id: 'fe-mapa-slot-id', name: '[slotId]/page.tsx', hint: 'Detalle slot, historial corto' }],
              },
            ],
          },
          {
            id: 'fe-proc',
            name: 'procesamiento/',
            hint: 'Primario, secundario, balance de masa, merma',
            children: [
              { id: 'fe-proc-page', name: 'page.tsx', hint: 'Cola solicitudes procesamiento' },
              {
                id: 'fe-proc-sol',
                name: 'solicitudes/',
                children: [
                  { id: 'fe-proc-sol-list', name: 'page.tsx' },
                  { id: 'fe-proc-sol-new', name: 'nueva/page.tsx', hint: 'Operador cuenta crea SOL proc' },
                  { id: 'fe-proc-sol-run', name: '[id]/page.tsx', hint: 'Ejecución, pesos, coproducto, merma' },
                ],
              },
            ],
          },
          {
            id: 'fe-ventas',
            name: 'ventas/',
            hint: 'OV, picking, FEFO, zona salida',
            children: [
              {
                id: 'fe-ventas-ov',
                name: 'ordenes-venta/',
                children: [
                  { id: 'fe-ventas-ov-list', name: 'page.tsx' },
                  { id: 'fe-ventas-ov-new', name: 'nueva/page.tsx' },
                  { id: 'fe-ventas-ov-detail', name: '[ovId]/page.tsx', hint: 'Despacho, transporte a bodega' },
                ],
              },
              {
                id: 'fe-ventas-picking',
                name: 'picking/',
                children: [{ id: 'fe-ventas-pick-page', name: 'page.tsx', hint: 'Reserva stock, FEFO' }],
              },
              {
                id: 'fe-ventas-salida',
                name: 'salida/',
                children: [
                  { id: 'fe-ventas-salida-page', name: 'page.tsx', hint: 'outboundBoxes, salida cruzada' },
                ],
              },
            ],
          },
          {
            id: 'fe-trans',
            name: 'transporte/',
            hint: 'Viajes TV-####, evidencias, cierre',
            children: [
              { id: 'fe-trans-page', name: 'page.tsx', hint: 'Listado viajes activos (transportista)' },
              {
                id: 'fe-trans-viaje',
                name: 'viajes/',
                children: [
                  { id: 'fe-trans-viaje-list', name: 'page.tsx' },
                  { id: 'fe-trans-viaje-detail', name: '[tvId]/page.tsx', hint: 'Entregas, foto, firma, GPS' },
                ],
              },
            ],
          },
          {
            id: 'fe-config',
            name: 'configuracion/',
            hint: 'Plataforma (configurador) + tenant (admin cuenta)',
            children: [
              {
                id: 'fe-cfg-plat',
                name: '(plataforma)/',
                hint: 'Solo rol configurador',
                children: [
                  {
                    id: 'fe-cfg-emp',
                    name: 'empresas/',
                    children: [
                      { id: 'fe-cfg-emp-list', name: 'page.tsx' },
                      { id: 'fe-cfg-emp-new', name: 'nueva/page.tsx' },
                      { id: 'fe-cfg-emp-edit', name: '[codigoEmpresa]/page.tsx' },
                    ],
                  },
                  {
                    id: 'fe-cfg-ten',
                    name: 'tenants/',
                    children: [
                      { id: 'fe-cfg-ten-list', name: 'page.tsx' },
                      { id: 'fe-cfg-ten-new', name: 'nuevo/page.tsx' },
                      { id: 'fe-cfg-ten-edit', name: '[codeCuenta]/page.tsx' },
                    ],
                  },
                ],
              },
              {
                id: 'fe-cfg-bodegas',
                name: 'bodegas/',
                children: [
                  { id: 'fe-cfg-bod-list', name: 'page.tsx', hint: 'Slots, capacidad, reglas plano' },
                  { id: 'fe-cfg-bod-new', name: 'nueva/page.tsx' },
                  { id: 'fe-cfg-bod-edit', name: '[warehouseId]/page.tsx' },
                ],
              },
              {
                id: 'fe-cfg-usuarios',
                name: 'usuarios/',
                children: [
                  { id: 'fe-cfg-usr-list', name: 'page.tsx' },
                  { id: 'fe-cfg-usr-new', name: 'nuevo/page.tsx' },
                  { id: 'fe-cfg-usr-edit', name: '[uid]/page.tsx', hint: 'asignacion_bodega por rol' },
                ],
              },
              {
                id: 'fe-cfg-catalogos',
                name: 'catalogos/',
                children: [
                  { id: 'fe-cfg-cat-prod', name: 'productos/page.tsx', hint: 'Import xlsx' },
                  { id: 'fe-cfg-cat-cli', name: 'clientes/page.tsx' },
                  { id: 'fe-cfg-cat-prov', name: 'proveedores/page.tsx' },
                  { id: 'fe-cfg-cat-comp', name: 'compradores/page.tsx' },
                  { id: 'fe-cfg-cat-cam', name: 'camiones/page.tsx' },
                  { id: 'fe-cfg-cat-pla', name: 'plantas/page.tsx' },
                ],
              },
            ],
          },
          {
            id: 'fe-reportes',
            name: 'reportes/',
            children: [
              { id: 'fe-rep-page', name: 'page.tsx', hint: 'Recharts, filtros por período' },
              { id: 'fe-rep-export', name: 'exportar/page.tsx', hint: 'PDF html2canvas+jsPDF, Excel xlsx' },
              { id: 'fe-rep-merma', name: 'merma/page.tsx' },
              { id: 'fe-rep-ocupacion', name: 'ocupacion/page.tsx' },
            ],
          },
        ],
      },
      {
        id: 'fe-api',
        name: 'api/',
        hint: 'Route Handlers — secretos server-side (doc §8)',
        children: [
          {
            id: 'fe-api-pedido',
            name: 'pedido-proveedor/',
            children: [{ id: 'fe-api-pedido-route', name: 'route.ts', hint: 'POST → n8n webhook' }],
          },
          {
            id: 'fe-api-evidencia',
            name: 'evidencia-transporte/',
            children: [{ id: 'fe-api-evid-route', name: 'route.ts', hint: 'POST → Cloudinary firmado' }],
          },
          {
            id: 'fe-api-health',
            name: 'health/',
            children: [{ id: 'fe-api-health-route', name: 'route.ts', hint: 'Healthcheck deploy' }],
          },
        ],
      },
    ],
  },
  {
    id: 'fe-components',
    name: 'components/',
    hint: 'UI React — sin lógica de persistencia directa',
    children: [
      {
        id: 'fe-comp-ui',
        name: 'ui/',
        children: [
          { id: 'fe-ui-button', name: 'Button.tsx' },
          { id: 'fe-ui-modal', name: 'Modal.tsx' },
          { id: 'fe-ui-table', name: 'DataTable.tsx' },
          { id: 'fe-ui-form', name: 'FormField.tsx' },
          { id: 'fe-ui-banner', name: 'MessageBanner.tsx' },
        ],
      },
      {
        id: 'fe-comp-layout',
        name: 'layout/',
        children: [
          { id: 'fe-lay-header', name: 'DashboardHeader.tsx' },
          { id: 'fe-lay-sidebar', name: 'RoleSidebar.tsx' },
          { id: 'fe-lay-shell', name: 'AppShell.tsx' },
        ],
      },
      {
        id: 'fe-comp-bodega',
        name: 'bodega/',
        children: [
          { id: 'fe-bod-slot-card', name: 'SlotCard.tsx' },
          { id: 'fe-bod-slots-grid', name: 'SlotsGrid.tsx' },
          { id: 'fe-bod-queue', name: 'WorkOrderQueue.tsx' },
          { id: 'fe-bod-alerts', name: 'AlertsPanel.tsx' },
          { id: 'fe-bod-move', name: 'MoveBoxForm.tsx' },
          { id: 'fe-bod-temp', name: 'TemperatureBadge.tsx' },
        ],
      },
      {
        id: 'fe-comp-ingreso',
        name: 'ingreso/',
        children: [
          { id: 'fe-ing-oc-table', name: 'OrdenCompraTable.tsx' },
          { id: 'fe-ing-recep', name: 'RecepcionForm.tsx' },
          { id: 'fe-ing-ciego', name: 'ConteoCiegoForm.tsx' },
        ],
      },
      {
        id: 'fe-comp-auth',
        name: 'auth/',
        children: [
          { id: 'fe-auth-card', name: 'LoginEmpresaCard.tsx' },
          { id: 'fe-auth-guard', name: 'RoleGate.tsx', hint: 'canAccessRoute() desde @/routes' },
        ],
      },
    ],
  },
  {
    id: 'fe-context',
    name: 'context/',
    children: [
      { id: 'fe-ctx-auth', name: 'AuthContext.tsx', hint: 'Sesión, codigoEmpresa, rol, codeCuenta' },
      { id: 'fe-ctx-warehouse', name: 'WarehouseContext.tsx', hint: 'Bodega activa, warehouseId' },
      { id: 'fe-ctx-tenant', name: 'TenantContext.tsx', hint: 'Tenant seleccionado (configurador)' },
    ],
  },
  {
    id: 'fe-hooks',
    name: 'hooks/',
    children: [
      { id: 'fe-hook-wh', name: 'useWarehouse.ts', hint: 'Suscripción Realtime warehouse_state' },
      { id: 'fe-hook-slots', name: 'useSlots.ts', hint: 'Mapa + locking UI' },
      { id: 'fe-hook-auth', name: 'useAuth.ts' },
      { id: 'fe-hook-orders', name: 'useWorkOrders.ts' },
      { id: 'fe-hook-alerts', name: 'useAlerts.ts' },
      { id: 'fe-hook-debounce', name: 'useDebounce.ts' },
    ],
  },
  {
    id: 'fe-services',
    name: 'services/',
    hint: 'Clientes HTTP → NestJS; wrappers Supabase lectura',
    children: [
      { id: 'fe-svc-nest', name: 'nestClient.ts', hint: 'Axios/fetch + JWT Supabase' },
      {
        id: 'fe-svc-ingreso',
        name: 'ingreso/',
        children: [
          { id: 'fe-svc-oc', name: 'ordenCompraService.ts' },
          { id: 'fe-svc-sol', name: 'solicitudCompraService.ts' },
          { id: 'fe-svc-recep', name: 'recepcionService.ts' },
        ],
      },
      {
        id: 'fe-svc-inv',
        name: 'inventario/',
        children: [
          { id: 'fe-svc-mov', name: 'movimientoService.ts' },
          { id: 'fe-svc-lock', name: 'lockingService.ts' },
        ],
      },
      {
        id: 'fe-svc-ventas',
        name: 'ventas/',
        children: [{ id: 'fe-svc-ov', name: 'ordenVentaService.ts' }],
      },
      {
        id: 'fe-svc-proc',
        name: 'procesamiento/',
        children: [{ id: 'fe-svc-proc-sol', name: 'procesamientoService.ts' }],
      },
      {
        id: 'fe-svc-trans',
        name: 'transporte/',
        children: [{ id: 'fe-svc-tv', name: 'viajeTransporteService.ts' }],
      },
      {
        id: 'fe-svc-config',
        name: 'configuracion/',
        children: [
          { id: 'fe-svc-emp', name: 'empresaService.ts' },
          { id: 'fe-svc-tenant', name: 'cuentaService.ts' },
          { id: 'fe-svc-bod', name: 'bodegaService.ts' },
          { id: 'fe-svc-usr', name: 'usuarioService.ts' },
          { id: 'fe-svc-cat', name: 'catalogoService.ts' },
        ],
      },
      {
        id: 'fe-svc-supabase-read',
        name: 'supabase/',
        children: [
          { id: 'fe-svc-wh-read', name: 'warehouseStateReader.ts', hint: 'Lectura + canal Realtime' },
        ],
      },
    ],
  },
  {
    id: 'fe-lib',
    name: 'lib/',
    children: [
      {
        id: 'fe-lib-supabase',
        name: 'supabase/',
        children: [
          { id: 'fe-lib-sb-client', name: 'client.ts', hint: 'createBrowserClient' },
          { id: 'fe-lib-sb-server', name: 'server.ts', hint: 'createServerClient cookies' },
          { id: 'fe-lib-sb-types', name: 'database.types.ts', hint: 'Generado supabase gen types' },
        ],
      },
      { id: 'fe-lib-fridem', name: 'fridemClient.ts', hint: 'Proyecto Supabase Fridem solo lectura' },
      {
        id: 'fe-lib-schemas',
        name: 'schemas/',
        children: [
          { id: 'fe-lib-zod-oc', name: 'ordenCompra.schema.ts' },
          { id: 'fe-lib-zod-ov', name: 'ordenVenta.schema.ts' },
          { id: 'fe-lib-zod-box', name: 'caja.schema.ts' },
          { id: 'fe-lib-zod-auth', name: 'login.schema.ts' },
        ],
      },
      {
        id: 'fe-lib-domain',
        name: 'domain/',
        children: [
          { id: 'fe-lib-balance', name: 'balanceMasa.ts', hint: 'Coproducto, merma, remanente' },
          { id: 'fe-lib-fefo', name: 'fefo.ts' },
          { id: 'fe-lib-strip', name: 'stripUndefined.ts', hint: 'Espejo cliente del StripInterceptor' },
          { id: 'fe-lib-display', name: 'displayFormatters.ts' },
        ],
      },
      { id: 'fe-lib-rbac', name: 'rbac.ts', hint: 'Re-export canAccessRoute desde routes/ (opcional)' },
    ],
  },
  {
    id: 'fe-types',
    name: 'types/',
    children: [
      { id: 'fe-types-wms', name: 'wms.ts', hint: 'SlotState, BoxRecord, WorkOrder, Alert' },
      { id: 'fe-types-api', name: 'api.ts', hint: 'DTOs respuesta Nest' },
      { id: 'fe-types-roles', name: 'roles.ts' },
    ],
  },
  {
    id: 'fe-config',
    name: 'config/',
    children: [
      { id: 'fe-cfg-pedido', name: 'pedidoProveedorIntegracion.ts', hint: 'URLs n8n (no .env público)' },
    ],
  },
  {
    id: 'fe-public',
    name: 'public/',
    children: [
      { id: 'fe-pub-favicon', name: 'favicon.ico' },
      { id: 'fe-pub-icons', name: 'icons/' },
      { id: 'fe-pub-images', name: 'images/' },
    ],
  },
  {
    id: 'fe-styles',
    name: 'styles/',
    children: [
      { id: 'fe-styles-globals', name: 'globals.css', hint: 'Tailwind 4 @import' },
      { id: 'fe-styles-tokens', name: 'tokens.css' },
    ],
  },
  {
    id: 'fe-tests',
    name: 'tests/',
    hint: 'Vitest — lib/domain y schemas',
    children: [
      { id: 'fe-test-lib', name: 'lib/' },
      { id: 'fe-test-setup', name: 'setup.ts' },
    ],
  },
]

/** Patrón estándar por módulo Nest */
function nestModule(id, name, hint, extras = []) {
  return {
    id,
    name: `${name}/`,
    hint,
    children: [
      { id: `${id}-mod`, name: `${name}.module.ts` },
      { id: `${id}-ctrl`, name: `${name}.controller.ts` },
      { id: `${id}-svc`, name: `${name}.service.ts` },
      {
        id: `${id}-dto`,
        name: 'dto/',
        children: extras.map((e, i) => ({
          id: `${id}-dto-${i}`,
          name: e.name,
          hint: e.hint,
        })),
      },
    ],
  }
}

/** @type {ArchNode[]} */
export const BACKEND_TREE = [
  { id: 'be-env', name: '.env.example', hint: 'SUPABASE_URL, SERVICE_ROLE_KEY, N8N_*' },
  { id: 'be-package', name: 'package.json' },
  { id: 'be-nest-cli', name: 'nest-cli.json' },
  { id: 'be-tsconfig', name: 'tsconfig.json' },
  { id: 'be-tsbuild', name: 'tsconfig.build.json' },
  {
    id: 'be-src',
    name: 'src/',
    children: [
      { id: 'be-main', name: 'main.ts', hint: 'Bootstrap, CORS, Swagger /api/docs' },
      { id: 'be-app-module', name: 'app.module.ts', hint: 'Importa todos los modules/' },
      {
        id: 'be-common',
        name: 'common/',
        hint: 'Cross-cutting Nest',
        children: [
          {
            id: 'be-decorators',
            name: 'decorators/',
            children: [
              { id: 'be-dec-roles', name: 'roles.decorator.ts', hint: '@Roles(...)' },
              { id: 'be-dec-user', name: 'current-user.decorator.ts', hint: '@CurrentUser()' },
              { id: 'be-dec-tenant', name: 'codigo-cuenta.decorator.ts' },
            ],
          },
          {
            id: 'be-guards',
            name: 'guards/',
            children: [
              { id: 'be-guard-auth', name: 'auth.guard.ts', hint: 'Valida JWT Supabase' },
              { id: 'be-guard-roles', name: 'roles.guard.ts' },
            ],
          },
          {
            id: 'be-interceptors',
            name: 'interceptors/',
            children: [
              { id: 'be-int-strip', name: 'strip-undefined.interceptor.ts', hint: 'Elimina undefined antes de persistir' },
              { id: 'be-int-log', name: 'logging.interceptor.ts' },
            ],
          },
          {
            id: 'be-pipes',
            name: 'pipes/',
            children: [{ id: 'be-pipe-val', name: 'validation.pipe.ts' }],
          },
          {
            id: 'be-filters',
            name: 'filters/',
            children: [{ id: 'be-filter-http', name: 'http-exception.filter.ts' }],
          },
          {
            id: 'be-interfaces',
            name: 'interfaces/',
            children: [
              { id: 'be-int-jwt', name: 'jwt-payload.interface.ts' },
              { id: 'be-int-user', name: 'authenticated-user.interface.ts' },
            ],
          },
        ],
      },
      {
        id: 'be-supabase',
        name: 'supabase/',
        hint: 'Admin SDK — service role',
        children: [
          { id: 'be-supabase-mod', name: 'supabase.module.ts' },
          {
            id: 'be-supabase-svc',
            name: 'supabase.service.ts',
            hint: 'saveWarehouseState (merge), transacciones, contadores TV',
          },
        ],
      },
      {
        id: 'be-modules',
        name: 'modules/',
        hint: 'Dominios WMS — un módulo por bounded context',
        children: [
          nestModule('be-mod-auth', 'auth', 'Perfiles, permisos, bootstrap sesión', [
            { name: 'login-empresa.dto.ts' },
            { name: 'session-profile.dto.ts' },
          ]),
          nestModule('be-mod-config', 'configuracion', 'Empresa, tenant, bodega, catálogos, usuarios', [
            { name: 'create-empresa.dto.ts' },
            { name: 'create-cuenta.dto.ts' },
            { name: 'create-bodega.dto.ts' },
            { name: 'create-usuario.dto.ts' },
            { name: 'catalogo-producto.dto.ts' },
          ]),
          nestModule('be-mod-ingreso', 'ingreso', 'SOL, OC, recepción, conciliación ciega, cajas inbound', [
            { name: 'create-sol.dto.ts' },
            { name: 'create-oc.dto.ts' },
            { name: 'cerrar-recepcion.dto.ts' },
            { name: 'registrar-caja.dto.ts' },
          ]),
          nestModule('be-mod-inv', 'inventario', 'Slots, locking, movimientos, warehouse_state', [
            { name: 'mover-slot.dto.ts' },
            { name: 'lock-slot.dto.ts' },
            { name: 'work-order.dto.ts' },
          ]),
          nestModule('be-mod-proc', 'procesamiento', 'Solicitudes, balance masa, merma, remanente', [
            { name: 'iniciar-procesamiento.dto.ts' },
            { name: 'cerrar-procesamiento.dto.ts' },
            { name: 'balance-masa.dto.ts' },
          ]),
          nestModule('be-mod-ventas', 'ventas', 'OV, líneas, FEFO, picking, despacho', [
            { name: 'create-ov.dto.ts' },
            { name: 'reservar-stock.dto.ts' },
            { name: 'despachar-ov.dto.ts' },
          ]),
          nestModule('be-mod-trans', 'transporte', 'Viajes TV-####, evidencias, salida cruzada', [
            { name: 'create-viaje.dto.ts' },
            { name: 'registrar-entrega.dto.ts' },
            { name: 'validar-peso-salida.dto.ts' },
          ]),
          {
            id: 'be-mod-integraciones',
            name: 'integraciones/',
            hint: 'n8n, webhooks salientes',
            children: [
              { id: 'be-mod-int-mod', name: 'integraciones.module.ts' },
              { id: 'be-mod-int-svc', name: 'integraciones.service.ts', hint: 'HttpModule → n8n' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'be-test',
    name: 'test/',
    children: [
      { id: 'be-test-e2e', name: 'app.e2e-spec.ts' },
      { id: 'be-test-jest', name: 'jest-e2e.json' },
    ],
  },
  {
    id: 'be-unit',
    name: 'src/**/*.spec.ts',
    hint: 'Unitarios junto a services (Vitest/Jest)',
  },
]
