# ─────────────────────────────────────────────
#  Furni-Store — Backend (FastAPI + Uvicorn)
# ─────────────────────────────────────────────
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install OS-level deps (only what is needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first
# (separate layer so Docker caches it unless requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the source code
COPY . .

# Ensure the uploads folder exists at runtime
RUN mkdir -p uploads

# Expose the port Uvicorn will listen on
EXPOSE 8000

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
