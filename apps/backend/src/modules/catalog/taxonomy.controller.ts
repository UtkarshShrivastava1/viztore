import { Request, Response } from 'express';
import { taxonomyService } from './taxonomy.service.js';

export class TaxonomyController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await taxonomyService.getCategories();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'TAXONOMY_CATEGORIES_ERROR', message: err.message },
      });
    }
  }

  async getSubcategories(req: Request, res: Response) {
    try {
      const category = (req.query.category as string) || '';
      if (!category) {
        return res.status(400).json({
          success: false,
          error: { code: 'CATEGORY_REQUIRED', message: 'Category query parameter is required' },
        });
      }

      const subcategories = await taxonomyService.getSubcategories(category);
      return res.status(200).json({
        success: true,
        data: subcategories,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'TAXONOMY_SUBCATEGORIES_ERROR', message: err.message },
      });
    }
  }

  async getProductTypes(req: Request, res: Response) {
    try {
      const category = (req.query.category as string) || '';
      const subcategory = (req.query.subCategory as string) || (req.query.subcategory as string) || '';

      if (!category || !subcategory) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PARAMS_REQUIRED',
            message: 'Both category and subCategory query parameters are required',
          },
        });
      }

      const productTypes = await taxonomyService.getProductTypes(category, subcategory);
      return res.status(200).json({
        success: true,
        data: productTypes,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'TAXONOMY_PRODUCT_TYPES_ERROR', message: err.message },
      });
    }
  }

  async getAttributes(req: Request, res: Response) {
    try {
      const productType = (req.query.productType as string) || '';
      const category = (req.query.category as string) || undefined;

      if (!productType) {
        return res.status(400).json({
          success: false,
          error: { code: 'PRODUCT_TYPE_REQUIRED', message: 'productType query parameter is required' },
        });
      }

      const attributes = await taxonomyService.getAttributes(productType, category);
      return res.status(200).json({
        success: true,
        data: attributes,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'TAXONOMY_ATTRIBUTES_ERROR', message: err.message },
      });
    }
  }

  async lookupHSN(req: Request, res: Response) {
    try {
      const category = (req.query.category as string) || '';
      const subcategory = (req.query.subCategory as string) || (req.query.subcategory as string) || '';
      const productType = (req.query.productType as string) || '';

      const hsn = taxonomyService.lookupHSN(category, subcategory, productType);
      return res.status(200).json({
        success: true,
        data: hsn,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'HSN_LOOKUP_ERROR', message: err.message },
      });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 15;

      const matches = await taxonomyService.searchTaxonomy(query, limit);
      return res.status(200).json({
        success: true,
        data: matches,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'TAXONOMY_SEARCH_ERROR', message: err.message },
      });
    }
  }
}

export const taxonomyController = new TaxonomyController();
