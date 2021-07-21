#!/bin/bash

cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
    API_ENDPOINT: '${API_ENDPOINT}'
};
EOF
