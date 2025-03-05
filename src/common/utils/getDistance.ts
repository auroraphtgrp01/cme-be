import axios from 'axios';

interface OSRMResponse {
  code: string;
  routes: {
    distance: number;
    duration: number;
    legs: {
      distance: number;
      duration: number;
      steps: any[];
      summary: string;
    }[];
  }[];
  waypoints: {
    hint: string;
    distance: number;
    name: string;
    location: number[];
  }[];
}

export async function getDistance(
  fromCoordinates: string,
  toCoordinates: string
): Promise<number> {
  try {
    const response = await axios.get<OSRMResponse>(
      `http://router.project-osrm.org/route/v1/driving/${fromCoordinates};${toCoordinates}?overview=false`
    );

    const distanceInMeters = response.data.routes[0].distance;
    const distanceInKm = Math.round((distanceInMeters / 1000) * 100) / 100;

    return distanceInKm;
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw new Error('Failed to calculate distance');
  }
}
