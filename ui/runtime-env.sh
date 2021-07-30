#!/bin/bash

cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
    API_ENDPOINT: '${API_ENDPOINT}',
    CLIENT_ID: '${CLIENT_ID}',
    AUTHORITY: '${AUTHORITY}'
};
EOF

cat > /usr/share/nginx/html/.well-known/microsoft-identity-association.json << EOF
{
  "associatedApplications": [
    {
      "applicationId": "${CLIENT_ID}"
    }
  ]
}
EOF
