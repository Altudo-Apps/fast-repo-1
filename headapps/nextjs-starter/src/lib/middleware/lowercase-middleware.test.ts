import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LowercaseMiddleware } from './lowercase-middleware';
import { NextRequest, NextResponse } from 'next/server';

// Mock the debug module
vi.mock('debug', () => ({
  default: vi.fn(() => vi.fn()),
}));

describe('LowercaseMiddleware', () => {
  let middleware: LowercaseMiddleware;

  beforeEach(() => {
    middleware = new LowercaseMiddleware();
    vi.clearAllMocks();
  });

  describe('handle', () => {
    it('should return response unchanged when pathname is already lowercase', async () => {
      // Arrange
      const url = 'http://localhost:3000/products/item';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result).toBe(res);
    });

    it('should redirect when pathname contains uppercase characters', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products/Item';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.status).toBe(301);
      expect(result.headers.get('location')).toBe('http://localhost:3000/products/item');
    });

    it('should redirect with 301 status code for SEO purposes', async () => {
      // Arrange
      const url = 'http://localhost:3000/UPPERCASE';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.status).toBe(301);
    });

    it('should handle paths with mixed case correctly', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products/iTeMs/DeTaiLs';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/products/items/details');
    });

    it('should preserve query parameters when redirecting', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products?id=123&sort=ASC';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/products?id=123&sort=ASC');
    });

    it('should preserve hash fragments when redirecting', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products#Section';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/products#Section');
    });

    it('should handle root path correctly', async () => {
      // Arrange
      const url = 'http://localhost:3000/';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result).toBe(res);
    });

    it('should handle paths with only uppercase letters', async () => {
      // Arrange
      const url = 'http://localhost:3000/PRODUCTS';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/products');
    });

    it('should handle paths with special characters and uppercase', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products-And-Services/Item_123';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe(
        'http://localhost:3000/products-and-services/item_123'
      );
    });

    it('should handle paths with numbers and uppercase letters', async () => {
      // Arrange
      const url = 'http://localhost:3000/Product123/Item456';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/product123/item456');
    });

    it('should handle deeply nested paths with uppercase', async () => {
      // Arrange
      const url = 'http://localhost:3000/Category/SubCategory/Product/Details';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe(
        'http://localhost:3000/category/subcategory/product/details'
      );
    });

    it('should handle paths with trailing slash and uppercase', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products/';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/products/');
    });

    it('should handle paths with encoded characters and uppercase', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products%20And%20Services/Item';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe(
        'http://localhost:3000/products%20and%20services/item'
      );
    });

    it('should return response unchanged for lowercase paths with special chars', async () => {
      // Arrange
      const url = 'http://localhost:3000/products-and-services/item_123';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result).toBe(res);
    });

    it('should handle single uppercase letter in path', async () => {
      // Arrange
      const url = 'http://localhost:3000/P';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toBe('http://localhost:3000/p');
    });

    it('should preserve port numbers when redirecting', async () => {
      // Arrange
      const url = 'http://localhost:3000/Products';
      const req = new NextRequest(url);
      const res = NextResponse.next();

      // Act
      const result = await middleware.handle(req, res);

      // Assert
      expect(result.headers.get('location')).toContain(':3000');
    });
  });
});
