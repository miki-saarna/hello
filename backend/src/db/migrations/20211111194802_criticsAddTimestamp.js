
exports.up = function(knex) {
    return knex.schema.table('critics', (table) => {
      table.timestamps(true, true);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('critics', (table) => {
        table.dropColumn("created_at")
        table.dropColumn("updated_at")
    })
  };
  