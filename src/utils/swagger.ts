import { SWAGGER_SERVER } from '@/config/env';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Real-Time Notification System API',
        version: '1.0.0',
        description: 'API documentation for the Real-Time Notification System project',
    },
    tags: [
        { name: "User", description: "User APIs" },
        { name: "Auth", description: "Authentication APIs" },
        { name: "Notifications", description: "Notification APIs" },
    ],
    servers: [
        {
            url: SWAGGER_SERVER || 'http://localhost:3000',
            description: 'Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Swagger to scan router files
};

export const swaggerSpec = swaggerJSDoc(options);
