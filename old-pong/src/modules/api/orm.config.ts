import { TypeOrmModuleOptions } from '@nestjs/typeorm';


export const DBconfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'riezu.eus', // Cambia esto con la dirección de tu servidor PostgreSQL si es necesario
    port: 5432, // Cambia esto con el puerto de tu servidor PostgreSQL si es necesario
    username: 'postgres', // Cambia esto con tu nombre de usuario de PostgreSQL
    password: 'postgress', // Cambia esto con tu contraseña de PostgreSQL
    database: 'transcendence', // Cambia esto con el nombre de tu base de datos en PostgreSQL
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: false
};

