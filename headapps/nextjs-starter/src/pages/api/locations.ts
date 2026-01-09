import { NextApiRequest, NextApiResponse } from 'next';
import locations from './locations.json';

// This is a mock API route for the locations. It is used to simulate the locations API.
// It is used to test the locations API in the locations component.
// It is not used in the production environment.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  console.log('[API /api/locations] Query:', req.query);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (id && typeof id === 'string') {
    const result = locations.locationResults.find((location) => location.locationID === id);
    console.log('[API /api/locations] Returning single result for id:', id, 'found:', !!result);
    res.status(200).json(result);
    return;
  }

  console.log(
    '[API /api/locations] Returning list count:',
    Array.isArray(locations.locationResults) ? locations.locationResults.length : 'n/a'
  );
  res.status(200).json(locations);
  return;
};

export default handler;
