declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        JWT_SECRET: string;
        JWT_MAX_AGE:number
        JWT_MAX_AGE_LONG:number
        PORT: number;
        MAIL_ENCRYPTION_KEY:string;
        MAIL_ENCRYPTION_IV:string;
        DATABASE_CONNECTION:string
        CLIENT_DOMAIN:string;
        CLIENT_PORT:number;
        PROTOCOL:string;
        APPLICATION_EMAIL_USER:string;
        APPLICATION_EMAIL_PASSKEY:string;
    }

}