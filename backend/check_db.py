from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("PRAGMA table_info(orders)"))
    print("orders columns:")
    for row in result:
        print(row)

    result2 = conn.execute(text("PRAGMA table_info(order_items)"))
    print("\norder_items columns:")
    for row in result2:
        print(row)
