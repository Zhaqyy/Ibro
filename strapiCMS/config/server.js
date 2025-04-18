module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  
  url: process.env.HEROKU_URL,
  admin: {
    url: '/dashboard',
    secret: 'zVjfvgfS6Zi+iyRKIJq9LQ=='
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
