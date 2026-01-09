import type { NextApiRequest, NextApiResponse } from 'next';
import { EditingRenderMiddleware } from '@sitecore-content-sdk/nextjs/editing';

/**
 * This Next.js API route is used to handle GET requests from Sitecore Editor.
 * This route should match the `serverSideRenderingEngineEndpointUrl` in your Sitecore configuration,
 * which is set to "http://<rendering_host>/api/editing/render" by default (see the settings item under /sitecore/content/<your/site/path>/Settings/Site Grouping).
 *
 * The `EditingRenderMiddleware` will
 *  1. Extract data about the route we need to render from the Sitecore Editor GET request
 *  2. Enable Next.js Preview Mode, passing the route data as preview data
 *  3. Redirect the request to the route, passing along the Preview Mode cookies.
 *     This allows retrieval of the editing data in preview context (via an `EditingDataService`) - see `SitecorePagePropsFactory`
 *  4. The redirected request will render the page with editing markup in place
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    responseLimit: false,
  },
};

// Wire up the EditingRenderMiddleware handler and ensure we always return HTML
const editingRenderMiddleware = new EditingRenderMiddleware();
const editingRenderHandler = editingRenderMiddleware.getHandler();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Type assertion: Sitecore Editor provides all required query params; middleware validates internally
  return editingRenderHandler(req as Parameters<typeof editingRenderHandler>[0], res);
};

export default handler;
