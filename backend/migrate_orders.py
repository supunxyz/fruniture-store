"""
Migration: Add missing columns to orders table
"""
from database import engine
from sqlalchemy import text

migrations = [
    "ALTER TABLE orders ADD COLUMN payment_method VARCHAR",
    "ALTER TABLE orders ADD COLUMN address VARCHAR",
    "ALTER TABLE orders ADD COLUMN mobile1 VARCHAR",
    "ALTER TABLE orders ADD COLUMN mobile2 VARCHAR",
]

with engine.connect() as conn:
    for sql in migrations:
        try:
            conn.execute(text(sql))
            print(f"OK: {sql}")
        except Exception as e:
            # Column might already exist
            print(f"SKIP ({e}): {sql}")
    conn.commit()

print("\nDone! Verifying final schema:")
with engine.connect() as conn:
    result = conn.execute(text("PRAGMA table_info(orders)"))
    for row in result:
        print(row)
