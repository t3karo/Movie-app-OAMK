import pool from "../helpers/db.js"


const insertUser = async (email, hashedPassword, firstname, lastname, createdAt) => {
    return await pool.query('insert into users (email,password_hash, firstname, lastname, created_at) values ($1,$2,$3,$4,$5) returning *', [email, hashedPassword, firstname, lastname, createdAt])
}

const selectUserByEmail = async (email) => {
    return await pool.query('select * from users where email=$1', [email])
}

const deleteUserByEmail = async (email) => {
    return await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
}

export { insertUser, selectUserByEmail, deleteUserByEmail }