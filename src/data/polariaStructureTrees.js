/**
 * Estructura real — polaria-wms-web y polaria-wms-api (jun 2026).
 * WEB_TREE sincronizado con el árbol del repo polaria-wms-web.
 * @typedef {{ id: string, name: string, hint?: string, children?: ArchNode[] }} ArchNode
 */

/** @type {ArchNode[]} */
export const WEB_TREE = [
  { id: 'pw-env', name: '.env.example', hint: 'API URL, Supabase keys — ver src/config/env.ts' },
  { id: 'pw-package', name: 'package.json', hint: 'Next.js, React, TS, Tailwind, Vitest, supabase-js' },
  { id: 'pw-next', name: 'next.config.ts' },
  {
    id: 'pw-docs',
    name: 'docs/',
    children: [
      { id: 'pw-doc-auth', name: 'AUTH.md', hint: '✅ prelogin, login, SSO Mateo' },
      { id: 'pw-doc-shell', name: 'POL-31-SHELL.md', hint: 'Shell dashboard por rol' },
    ],
  },
  { id: 'pw-public', name: 'public/', hint: 'logo, assets estáticos' },
  {
    id: 'pw-src',
    name: 'src/',
    children: [
      {
        id: 'pw-app',
        name: 'app/',
        hint: 'App Router — grupos (auth) y (shell)',
        children: [
          {
            id: 'pw-auth-group',
            name: '(auth)/',
            children: [
              { id: 'pw-login', name: 'login/page.tsx', hint: '✅ LoginFlow (prelogin → password)' },
              { id: 'pw-sso', name: 'auth/sso/page.tsx', hint: '✅ SsoFlow Mateo' },
            ],
          },
          {
            id: 'pw-shell',
            name: '(shell)/',
            children: [
              {
                id: 'pw-configurador',
                name: 'configurador/',
                hint: '✅ rol configurador',
                children: [
                  { id: 'pw-cfg-page', name: 'page.tsx', hint: 'Panel principal' },
                  {
                    id: 'pw-cfg-creacion',
                    name: 'creacion/',
                    children: [
                      { id: 'pw-cfg-cuentas', name: 'cuentas/page.tsx' },
                      { id: 'pw-cfg-bod-int', name: 'bodega-interna/page.tsx', hint: 'POST API bodegas' },
                      { id: 'pw-cfg-bod-ext', name: 'bodega-externa/page.tsx' },
                    ],
                  },
                  {
                    id: 'pw-cfg-asignacion',
                    name: 'asignacion/',
                    children: [{ id: 'pw-cfg-usuarios', name: 'usuarios/page.tsx' }],
                  },
                  {
                    id: 'pw-cfg-integracion',
                    name: 'integracion/page.tsx',
                    hint: '✅ bandeja solicitudes integración',
                  },
                ],
              },
              {
                id: 'pw-dashboard',
                name: 'dashboard/',
                hint: 'Operación por rol',
                children: [
                  {
                    id: 'pw-adm',
                    name: 'administracion/',
                    hint: '✅ administrador_cuenta',
                    children: [
                      { id: 'pw-adm-cat', name: 'catalogo/page.tsx' },
                      {
                        id: 'pw-adm-asig',
                        name: 'asignacion-creacion/',
                        children: [
                          { id: 'pw-adm-usu', name: 'usuarios/page.tsx' },
                          { id: 'pw-adm-prov', name: 'proveedores/page.tsx' },
                          { id: 'pw-adm-comp', name: 'compradores/page.tsx' },
                          { id: 'pw-adm-cam', name: 'camiones/page.tsx' },
                          { id: 'pw-adm-bi', name: 'bodega-interna/page.tsx' },
                          { id: 'pw-adm-be', name: 'bodega-externa/page.tsx' },
                        ],
                      },
                    ],
                  },
                  { id: 'pw-ingreso', name: 'ingreso/page.tsx', hint: '✅ SOL/OC (purchases)' },
                  { id: 'pw-mapa', name: 'mapa/page.tsx', hint: '🟡 mapa inventario' },
                  { id: 'pw-proc', name: 'procesamiento/page.tsx', hint: '🟡 shell' },
                  { id: 'pw-ventas', name: 'ventas/page.tsx', hint: '🟡 shell' },
                  { id: 'pw-trans', name: 'transporte/page.tsx', hint: '🟡 shell' },
                  { id: 'pw-rep', name: 'reporteria/page.tsx', hint: '🔵 diseño' },
                ],
              },
              { id: 'pw-platform', name: 'platform/page.tsx', hint: 'Entrada configurador' },
            ],
          },
          {
            id: 'pw-resolve-tenant',
            name: 'login/resolve-tenant/route.ts',
            hint: 'Route handler prelogin tenant',
          },
        ],
      },
      {
        id: 'pw-components',
        name: 'components/',
        children: [
          {
            id: 'pw-comp-auth',
            name: 'auth/',
            hint: '✅ guards + LoginFlow + SsoFlow',
            children: [
              { id: 'pw-guard-auth', name: 'AuthGuard.tsx' },
              { id: 'pw-guard-role', name: 'RoleGate.tsx' },
              { id: 'pw-guard-tenant', name: 'TenantScopeGuard.tsx' },
              { id: 'pw-guard-bod', name: 'BodegaRequiredGuard.tsx' },
              { id: 'pw-login-flow', name: 'LoginFlow.tsx' },
            ],
          },
          {
            id: 'pw-comp-layouts',
            name: 'layouts/',
            children: [
              { id: 'pw-shell-layout', name: 'AppShellLayout.tsx' },
              { id: 'pw-auth-layout', name: 'AuthLayout.tsx' },
            ],
          },
          {
            id: 'pw-comp-shared',
            name: 'shared/',
            hint: 'Design system Polaria',
            children: [
              { id: 'pw-table', name: 'PolariaDataTable.tsx' },
              { id: 'pw-modal', name: 'PolariaFormModal.tsx' },
              { id: 'pw-placeholder', name: 'ModulePlaceholder.tsx', hint: '🟡 módulos pendientes' },
            ],
          },
        ],
      },
      {
        id: 'pw-config',
        name: 'config/',
        children: [
          { id: 'pw-env-ts', name: 'env.ts' },
          { id: 'pw-routes', name: 'routes.ts', hint: 'Rutas tipadas del shell' },
          { id: 'pw-nav', name: 'navigation.ts', hint: 'Menú por rol' },
        ],
      },
      {
        id: 'pw-constants',
        name: 'constants/',
        children: [
          { id: 'pw-roles', name: 'wms-roles.ts' },
          { id: 'pw-perms', name: 'permissions.ts' },
        ],
      },
      {
        id: 'pw-hooks',
        name: 'hooks/',
        children: [
          { id: 'pw-hook-perm', name: 'usePermissions.ts' },
          { id: 'pw-hook-ws', name: 'useWarehouseStateRealtime.ts', hint: '🟡 Realtime mapa' },
        ],
      },
      {
        id: 'pw-lib',
        name: 'lib/',
        children: [
          {
            id: 'pw-lib-sb',
            name: 'supabase/',
            children: [
              { id: 'pw-sb-client', name: 'client.ts', hint: 'Lecturas con JWT + RLS' },
              { id: 'pw-sb-domain', name: 'domain-query.ts' },
            ],
          },
          { id: 'pw-lib-auth', name: 'auth-session.ts' },
          { id: 'pw-lib-mateo', name: 'mateo-sso-exit.ts', hint: '✅ SSO Mateo' },
          { id: 'pw-lib-tenant', name: 'tenant-headers.ts' },
        ],
      },
      {
        id: 'pw-modules',
        name: 'modules/',
        hint: 'Dominios WMS por carpeta',
        children: [
          {
            id: 'pw-mod-auth',
            name: 'auth/',
            hint: '✅',
            children: [{ id: 'pw-auth-svc', name: 'services/auth.service.ts' }],
          },
          {
            id: 'pw-mod-config',
            name: 'configurator/',
            hint: '✅ cuentas, usuarios, bodegas',
            children: [
              { id: 'pw-cfg-svc-cuentas', name: 'services/cuentas.service.ts' },
              { id: 'pw-cfg-svc-usu', name: 'services/usuarios.service.ts' },
              { id: 'pw-bod-int', name: 'services/bodegas-internas.service.ts', hint: 'POST /configuracion/bodegas' },
              { id: 'pw-bod-ext', name: 'services/bodegas-externas.service.ts' },
              { id: 'pw-cfg-bod-list', name: 'components/BodegaInternaListView.tsx' },
            ],
          },
          {
            id: 'pw-mod-admin',
            name: 'admin-panel/',
            hint: '✅ catálogos tenant',
            children: [
              { id: 'pw-adm-svc-prov', name: 'services/proveedores.service.ts' },
              { id: 'pw-adm-svc-prod', name: 'services/productos-catalogo.service.ts' },
              { id: 'pw-adm-svc-usu', name: 'services/usuarios-admin.service.ts' },
              { id: 'pw-adm-svc-bod', name: 'services/bodegas-internas-admin.service.ts' },
            ],
          },
          {
            id: 'pw-mod-purch',
            name: 'purchases/',
            hint: '✅ SOL/OC vía API',
            children: [
              { id: 'pw-purch-svc', name: 'services/purchases.service.ts' },
              { id: 'pw-purch-ui', name: 'components/IngresoPageContent.tsx' },
            ],
          },
          {
            id: 'pw-mod-dash',
            name: 'dashboard/',
            hint: '✅ home widgets',
            children: [{ id: 'pw-dash-home', name: 'components/DashboardHome.tsx' }],
          },
          { id: 'pw-mod-audit', name: 'audit/', hint: '✅ audit.service.ts' },
          {
            id: 'pw-mod-inv',
            name: 'inventory/',
            hint: '🟡 mapa + Realtime',
            children: [
              { id: 'pw-inv-ui', name: 'components/MapaInventarioPageContent.tsx' },
              { id: 'pw-inv-svc', name: 'services/inventory.service.ts' },
            ],
          },
          {
            id: 'pw-mod-proc-mod',
            name: 'processing/',
            hint: '🟡 shell',
            children: [{ id: 'pw-proc-ui', name: 'components/ProcesamientoPageContent.tsx' }],
          },
          {
            id: 'pw-mod-sales',
            name: 'sales/',
            hint: '🟡 shell',
            children: [{ id: 'pw-sales-ui', name: 'components/VentasPageContent.tsx' }],
          },
          {
            id: 'pw-mod-trans',
            name: 'transport/',
            hint: '🟡 shell',
            children: [{ id: 'pw-trans-ui', name: 'components/TransportePageContent.tsx' }],
          },
          { id: 'pw-mod-acc', name: 'accounts/', hint: '🔵 README placeholder' },
          { id: 'pw-mod-co', name: 'companies/', hint: '🔵 README placeholder' },
          { id: 'pw-mod-users', name: 'users/', hint: '🔵 README placeholder' },
          { id: 'pw-mod-wh', name: 'warehouses/', hint: '🔵 README placeholder' },
        ],
      },
      {
        id: 'pw-providers',
        name: 'providers/',
        children: [
          { id: 'pw-auth-prov', name: 'AuthProvider.tsx' },
          { id: 'pw-co-prov', name: 'CompanyProvider.tsx' },
        ],
      },
      {
        id: 'pw-services',
        name: 'services/',
        children: [
          { id: 'pw-api', name: 'api.ts', hint: 'Cliente HTTP → polaria-wms-api' },
          { id: 'pw-sb-svc', name: 'supabase.ts' },
        ],
      },
      { id: 'pw-stores', name: 'stores/auth.store.ts', hint: 'Sesión Zustand' },
    ],
  },
]

/** @type {ArchNode[]} */
export const API_TREE = [
  { id: 'pa-env-ex', name: '.env.example', hint: 'SUPABASE_*, DATABASE_URL, MATEO_*' },
  { id: 'pa-package', name: 'package.json', hint: 'NestJS 11, Prisma, Swagger' },
  { id: 'pa-nest-cli', name: 'nest-cli.json' },
  {
    id: 'pa-docs',
    name: 'docs/',
    children: [
      { id: 'pa-doc-modelo', name: 'MODELO-OPERATIVO.md', hint: '40 modelos Prisma, scope C / C+B' },
      { id: 'pa-doc-rls', name: 'TENANT-RLS.md', hint: 'RLS híbrido lectura vs escritura API' },
      { id: 'pa-doc-mateo', name: 'MATEO-INTEGRATION.md', hint: 'SSO handoff / exchange' },
    ],
  },
  {
    id: 'pa-github',
    name: '.github/workflows/',
    children: [{ id: 'pa-ci', name: 'ci.yml' }],
  },
  { id: 'pa-prisma-cfg', name: 'prisma.config.ts' },
  {
    id: 'pa-prisma-dir',
    name: 'prisma/',
    children: [{ id: 'pa-prisma', name: 'schema.prisma', hint: '40 modelos WMS' }],
  },
  {
    id: 'pa-src',
    name: 'src/',
    children: [
      { id: 'pa-main', name: 'main.ts', hint: 'Bootstrap + Swagger GET /api/docs' },
      { id: 'pa-app-mod', name: 'app.module.ts' },
      {
        id: 'pa-core',
        name: 'core/',
        hint: 'Infra transversal NestJS',
        children: [
          {
            id: 'pa-core-auth',
            name: 'auth/',
            children: [
              { id: 'pa-sb-auth', name: 'supabase-auth.service.ts' },
              { id: 'pa-sb-guard', name: 'supabase-auth.guard.ts' },
            ],
          },
          {
            id: 'pa-core-config',
            name: 'config/',
            children: [{ id: 'pa-env-cfg', name: 'env.config.ts' }],
          },
          {
            id: 'pa-core-db',
            name: 'database/',
            hint: 'Prisma + scope tenant',
            children: [
              { id: 'pa-prisma-svc', name: 'prisma.service.ts' },
              { id: 'pa-tenant-repo', name: 'tenant-scoped.repository.ts' },
              { id: 'pa-tenant-util', name: 'tenant-scope.util.ts' },
            ],
          },
          {
            id: 'pa-guards',
            name: 'guards/',
            hint: '✅ JwtAuth, Tenant, Roles, SensitiveWrite',
            children: [
              { id: 'pa-jwt', name: 'jwt-auth.guard.ts' },
              { id: 'pa-tenant-g', name: 'tenant.guard.ts' },
              { id: 'pa-roles', name: 'roles.guard.ts' },
              { id: 'pa-sensitive', name: 'sensitive-write.guard.ts' },
            ],
          },
          {
            id: 'pa-interceptors',
            name: 'interceptors/',
            children: [{ id: 'pa-req-tenant', name: 'require-tenant-context.interceptor.ts' }],
          },
          {
            id: 'pa-swagger',
            name: 'swagger/',
            children: [{ id: 'pa-sw-setup', name: 'setup-swagger.ts' }],
          },
          {
            id: 'pa-tenant',
            name: 'tenant/',
            children: [
              { id: 'pa-tenant-svc', name: 'tenant.service.ts' },
              { id: 'pa-tenant-ctx', name: 'tenant-context.interface.ts' },
            ],
          },
          { id: 'pa-filters', name: 'filters/global-exception.filter.ts' },
          { id: 'pa-decorators', name: 'decorators/tenant-context.decorator.ts' },
        ],
      },
      {
        id: 'pa-generated',
        name: 'generated/prisma/',
        hint: 'Cliente generado — no editar',
        children: [
          { id: 'pa-gen-client', name: 'client.ts' },
          {
            id: 'pa-gen-models',
            name: 'models/',
            hint: '40 modelos (Empresa, Bodega, SolicitudCompra, WarehouseState…)',
          },
        ],
      },
      {
        id: 'pa-modules',
        name: 'modules/',
        children: [
          {
            id: 'pa-auth',
            name: 'auth/',
            hint: '✅ implementado',
            children: [
              { id: 'pa-auth-api', name: 'API.md' },
              { id: 'pa-auth-ctrl', name: 'auth.controller.ts', hint: 'prelogin, login, me, logout, Mateo' },
              { id: 'pa-auth-svc', name: 'auth.service.ts' },
              { id: 'pa-mateo', name: 'mateo-handoff.service.ts' },
              {
                id: 'pa-auth-dto',
                name: 'dto/',
                children: [
                  { id: 'pa-dto-pre', name: 'prelogin.dto.ts' },
                  { id: 'pa-dto-login', name: 'login.dto.ts' },
                  { id: 'pa-dto-mateo', name: 'mateo-exchange.dto.ts' },
                ],
              },
              { id: 'pa-auth-repo', name: 'infrastructure/usuario.repository.ts' },
            ],
          },
          {
            id: 'pa-configurator',
            name: 'configurator/',
            hint: '✅ implementado',
            children: [
              {
                id: 'pa-cfg-ctrl',
                name: 'controllers/',
                children: [
                  { id: 'pa-cfg-usu', name: 'configurador-usuarios.controller.ts' },
                  { id: 'pa-adm-usu', name: 'administracion-usuarios.controller.ts' },
                ],
              },
              {
                id: 'pa-cfg-svc',
                name: 'services/',
                children: [
                  { id: 'pa-cfg-usu-svc', name: 'configurador-usuarios.service.ts' },
                  { id: 'pa-adm-usu-svc', name: 'administracion-usuarios.service.ts' },
                ],
              },
              { id: 'pa-cfg-repo', name: 'infrastructure/configurador-usuario.repository.ts' },
            ],
          },
          {
            id: 'pa-configuracion',
            name: 'configuracion/',
            hint: '✅ POST /configuracion/bodegas + bootstrap-layout',
            children: [
              {
                id: 'pa-cfg-bod-ctrl',
                name: 'controllers/',
                children: [
                  { id: 'pa-cfg-bod', name: 'bodega.controller.ts' },
                  { id: 'pa-cfg-layout', name: 'bodega-layout.controller.ts' },
                ],
              },
              { id: 'pa-cfg-bod-svc', name: 'services/bodega.service.ts' },
              { id: 'pa-cfg-layout-svc', name: 'services/bodega-layout-bootstrap.service.ts' },
            ],
          },
          {
            id: 'pa-integration',
            name: 'integration/',
            hint: '✅ /integracion/solicitudes + bandeja configurador',
            children: [
              { id: 'pa-int-ctrl', name: 'controllers/solicitud-integracion.controller.ts' },
              { id: 'pa-int-svc', name: 'services/solicitud-integracion.service.ts' },
            ],
          },
          { id: 'pa-audit', name: 'audit/', hint: '🟡 placeholder (clean architecture vacía)' },
          { id: 'pa-accounts', name: 'accounts/', hint: '🟡 placeholder' },
          { id: 'pa-companies', name: 'companies/', hint: '🟡 placeholder' },
          { id: 'pa-files', name: 'files/', hint: '🟡 placeholder' },
          { id: 'pa-health', name: 'health/', hint: '🟡 placeholder' },
          { id: 'pa-inv', name: 'inventory/', hint: '🟡 placeholder' },
          { id: 'pa-notif', name: 'notifications/', hint: '🟡 placeholder' },
          { id: 'pa-proc', name: 'processing/', hint: '🟡 placeholder' },
          { id: 'pa-purchases', name: 'purchases/', hint: '✅ /compras/solicitudes + /compras/ordenes' },
          { id: 'pa-sales', name: 'sales/', hint: '🟡 placeholder' },
          { id: 'pa-settings', name: 'settings/', hint: '🟡 placeholder' },
          { id: 'pa-transport', name: 'transport/', hint: '🟡 placeholder' },
          { id: 'pa-users', name: 'users/', hint: '🟡 placeholder' },
          { id: 'pa-wh', name: 'warehouses/', hint: '🟡 placeholder' },
        ],
      },
      {
        id: 'pa-shared',
        name: 'shared/',
        children: [
          {
            id: 'pa-sh-const',
            name: 'constants/',
            children: [
              { id: 'pa-sh-roles', name: 'roles.ts' },
              { id: 'pa-sh-auth-client', name: 'auth-client.constants.ts', hint: 'x-auth-client: WMS | MATEO' },
            ],
          },
          {
            id: 'pa-sh-dec',
            name: 'decorators/',
            children: [
              { id: 'pa-sh-user', name: 'current-user.decorator.ts' },
              { id: 'pa-sh-client', name: 'auth-client.decorator.ts' },
            ],
          },
          { id: 'pa-sh-ifaces', name: 'interfaces/user.interface.ts' },
          { id: 'pa-sh-email', name: 'utils/email.util.ts' },
        ],
      },
    ],
  },
  {
    id: 'pa-test',
    name: 'test/',
    hint: 'Jest e2e',
    children: [
      { id: 'pa-e2e-auth', name: 'auth.e2e-spec.ts' },
      { id: 'pa-e2e-cfg', name: 'configurador-usuarios.e2e-spec.ts' },
      { id: 'pa-e2e-adm', name: 'administracion-usuarios.e2e-spec.ts' },
    ],
  },
]

/** Alias legacy — preferir WEB_TREE / API_TREE */
export const FRONTEND_TREE = WEB_TREE
export const BACKEND_TREE = API_TREE
