const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ttc_clustering_development'