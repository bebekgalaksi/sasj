FROM python:3.11-slim

WORKDIR /app

# Ensure logs are flushed immediately
ENV PYTHONUNBUFFERED=1
ENV PORT=8081

# Copy datasets, backend, and frontend
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY dataset/ ./dataset/
COPY dataset_clean/ ./dataset_clean/
COPY .env* ./

# Expose application port
EXPOSE 8081

# Run server
CMD ["python", "backend/server.py"]
