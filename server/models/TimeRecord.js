import { runQuery, getAllRows } from '../utils/database.js';

export class TimeRecord {
  static async findByEmployee(db, employeeId) {
    return await getAllRows(
      db,
      'SELECT * FROM time_records WHERE employee_id = ? ORDER BY check_in DESC',
      [employeeId]
    );
  }

  static async checkIn(db, { employeeId, notes, latitude, longitude }) {
    return await runQuery(
      db,
      `INSERT INTO time_records (
        employee_id, 
        check_in, 
        notes, 
        latitude_in, 
        longitude_in
      ) VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?)`,
      [employeeId, notes, latitude, longitude]
    );
  }

  static async checkOut(db, id, { notes, latitude, longitude }) {
    return await runQuery(
      db,
      `UPDATE time_records 
       SET check_out = CURRENT_TIMESTAMP, 
           notes = COALESCE(?, notes),
           latitude_out = ?,
           longitude_out = ?
       WHERE id = ?`,
      [notes, latitude, longitude, id]
    );
  }
}