import { sql } from '@vercel/postgres';

// Function to add or update a user in the database
export async function upsertUser({ whop_user_id, name, email }) {
  const existingUser = await sql`
    SELECT * FROM users WHERE whop_user_id = ${whop_user_id}
  `;

  if (existingUser.length > 0) {
    // User already exists, update their information
    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}
      WHERE whop_user_id = ${whop_user_id}
    `;
  } else {
    // Insert new user
    await sql`
      INSERT INTO users (whop_user_id, name, email)
      VALUES (${whop_user_id}, ${name}, ${email})
    `;
  }
}

// Function to fetch a user by their Whop user ID
export async function getUserById(whop_user_id) {
  const users = await sql`
    SELECT * FROM users WHERE whop_user_id = ${whop_user_id}
  `;
  return users[0] || null;
}
