import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { swaggerSpec } from '../swagger.js';

describe('OpenAPI / Swagger Documentation (Task B-03)', () => {
  describe('swaggerSpec schema verification', () => {
    it('should conform to OpenAPI 3.0.3 specification', () => {
      expect(swaggerSpec).toBeDefined();
      expect(swaggerSpec.openapi).toBe('3.0.3');
      expect(swaggerSpec.info).toBeDefined();
      expect(swaggerSpec.info.title).toContain('Commerce Platform API');
      expect(swaggerSpec.info.version).toBe('1.0.0');
    });

    it('should define JWT bearer security scheme', () => {
      const securitySchemes = swaggerSpec.components?.securitySchemes;
      expect(securitySchemes).toBeDefined();
      expect(securitySchemes?.bearerAuth).toBeDefined();
      expect(securitySchemes?.bearerAuth.type).toBe('http');
      expect(securitySchemes?.bearerAuth.scheme).toBe('bearer');
    });

    it('should document all 7 domain modules plus system health probes', () => {
      const tagNames = swaggerSpec.tags?.map((t: { name: string }) => t.name);
      expect(tagNames).toContain('Auth');
      expect(tagNames).toContain('Stores');
      expect(tagNames).toContain('Catalog');
      expect(tagNames).toContain('Orders');
      expect(tagNames).toContain('Billing');
      expect(tagNames).toContain('Delivery');
      expect(tagNames).toContain('Notifications');
      expect(tagNames).toContain('System');
    });

    it('should include core endpoints across all modules in paths', () => {
      const paths = swaggerSpec.paths;
      expect(paths).toBeDefined();

      // Auth
      expect(paths['/auth/register']).toBeDefined();
      expect(paths['/auth/login']).toBeDefined();
      expect(paths['/auth/me']).toBeDefined();

      // Stores
      expect(paths['/stores']).toBeDefined();
      expect(paths['/stores/{id}']).toBeDefined();

      // Catalog
      expect(paths['/catalog/products']).toBeDefined();
      expect(paths['/catalog/products/{idOrSlug}']).toBeDefined();
      expect(paths['/catalog/products/barcode/{barcode}']).toBeDefined();

      // Orders
      expect(paths['/orders']).toBeDefined();
      expect(paths['/orders/{id}']).toBeDefined();
      expect(paths['/orders/{id}/verify-otp']).toBeDefined();
      expect(paths['/orders/{id}/cancel']).toBeDefined();

      // Billing (In-House Retail POS)
      expect(paths['/billing/pos/checkout']).toBeDefined();
      expect(paths['/billing/invoices']).toBeDefined();
      expect(paths['/billing/barcode/scan']).toBeDefined();
      expect(paths['/billing/summary']).toBeDefined();

      // Delivery & Notifications
      expect(paths['/delivery/orders/{orderId}/track']).toBeDefined();
      expect(paths['/notifications']).toBeDefined();

      // System probes
      expect(paths['/healthz']).toBeDefined();
      expect(paths['/readyz']).toBeDefined();
    });
  });

  describe('HTTP Endpoints verification', () => {
    const app = createApp();

    it('GET /api-docs.json should serve raw OpenAPI spec', async () => {
      const res = await request(app).get('/api-docs.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
      expect(res.body.openapi).toBe('3.0.3');
      expect(res.body.info.title).toContain('Commerce Platform API');
    });

    it('GET /docs.json alias should serve raw OpenAPI spec', async () => {
      const res = await request(app).get('/docs.json');
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBe('3.0.3');
    });

    it('GET /api-docs/ should serve interactive Swagger UI HTML', async () => {
      const res = await request(app).get('/api-docs/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/html/);
      expect(res.text).toContain('swagger-ui');
    });

    it('GET /api-docs should redirect to /api-docs/ or return Swagger HTML', async () => {
      const res = await request(app).get('/api-docs');
      // swagger-ui-express either redirects (301) to /api-docs/ or renders 200
      expect([200, 301]).toContain(res.status);
    });
  });
});
