
exports.up = function(knex) {
    return knex.schema.table('movies_theaters', (table) => {
      table.timestamps(true, true);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('movies_theaters', (table) => {
        table.dropColumn("created_at")
        table.dropColumn("updated_at")
    })
  };
  