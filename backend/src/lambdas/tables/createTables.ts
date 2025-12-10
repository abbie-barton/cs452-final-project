import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getPool } from "../../db/mysql";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("connecting to DB...")
    const pool = await getPool();

    // Test the connection
    await pool.query("SELECT 1");
    console.log("Connected to database!");

    await pool.execute(`DROP TABLE IF EXISTS medical_record`)
    await pool.execute(`DROP TABLE IF EXISTS animal_images`)
    await pool.execute(`DROP TABLE IF EXISTS animal`)
    // Create tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS animal (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        breed VARCHAR(255),
        species VARCHAR(100), 
        site VARCHAR(100),
        intake_date DATE,
        color VARCHAR(255),
        location_found VARCHAR(255),
        description VARCHAR(1000), 
        size VARCHAR(255),
        gender ENUM('Male', 'Female', 'Unknown'),
        spayed_or_neutered BOOLEAN,
        available_for_adoption BOOLEAN,
        housetrained BOOLEAN,
        declawed BOOLEAN,
        age INT
      );
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS animal_images (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        animal_id BIGINT NOT NULL,
        image_url VARCHAR(255),
        FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE CASCADE
      );`)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS medical_record (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        animal_id BIGINT NOT NULL,
        record_date DATE,
        record_type VARCHAR(100),
        notes VARCHAR(255),
        FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE CASCADE
      );
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Tables created successfully" }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
