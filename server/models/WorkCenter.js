import { runQuery, getAllRows, getRow } from '../utils/database.js';

export class WorkCenter {
  static async findAll(db) {
    return await getAllRows(db, 'SELECT * FROM work_centers');
  }

  static async create(db, { name, latitude, longitude, radius = 1000 }) {
    return await runQuery(
      db,
      'INSERT INTO work_centers (name, latitude, longitude, radius) VALUES (?, ?, ?, ?)',
      [name, latitude, longitude, radius]
    );
  }

  static async delete(db, id) {
    return await runQuery(
      db,
      'DELETE FROM work_centers WHERE id = ?',
      [id]
    );
  }

  static async isLocationValid(db, latitude, longitude) {
    const centers = await this.findAll(db);
    return centers.some(center => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        center.latitude,
        center.longitude
      );
      return distance <= center.radius;
    });
  }

  // Fórmula Haversine para calcular distancia entre dos puntos geográficos
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δφ = this.toRadians(lat2 - lat1);
    const Δλ = this.toRadians(lon2 - lon1);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en metros
  }

  static toRadians(degrees) {
    return degrees * (Math.PI/180);
  }
}