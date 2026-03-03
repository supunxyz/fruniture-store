import sqlite3

conn = sqlite3.connect('furni.db')
cursor = conn.cursor()

# Check if column already exists
cursor.execute("PRAGMA table_info(users)")
columns = [col[1] for col in cursor.fetchall()]

if 'phone_number' not in columns:
    cursor.execute("ALTER TABLE users ADD COLUMN phone_number TEXT")
    conn.commit()
    print("✅ phone_number column added successfully!")
else:
    print("ℹ️  phone_number column already exists.")

conn.close()
