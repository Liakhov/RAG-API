# Use the official Ollama image as base
FROM ollama/ollama:latest

# Install curl for health checking
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Expose the default Ollama API port
EXPOSE 11434

# Create a startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo '# Start Ollama in the background' >> /start.sh && \
    echo 'ollama serve &' >> /start.sh && \
    echo 'SERVER_PID=$!' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Wait for Ollama to start' >> /start.sh && \
    echo 'until curl -s http://localhost:11434/api/tags >/dev/null 2>&1; do' >> /start.sh && \
    echo '  echo "Waiting for Ollama to start..."' >> /start.sh && \
    echo '  sleep 1' >> /start.sh && \
    echo 'done' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Pull the gemma3:4b model' >> /start.sh && \
    echo 'echo "Pulling gemma3:4b model..."' >> /start.sh && \
    echo 'ollama run gemma3:4b' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Pull the nomic-embed-text model' >> /start.sh && \
    echo 'echo "Pulling nomic-embed-text model..."' >> /start.sh && \
    echo 'ollama pull nomic-embed-text' >> /start.sh && \
    echo '' >> /start.sh && \
    echo 'echo "Ollama is ready with gemma3:4b and nomic-embed-text models!"' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Wait for the server process' >> /start.sh && \
    echo 'wait $SERVER_PID' >> /start.sh

# Make the script executable
RUN chmod +x /start.sh

# Entrypoint to run the script when the container starts
ENTRYPOINT ["/start.sh"]