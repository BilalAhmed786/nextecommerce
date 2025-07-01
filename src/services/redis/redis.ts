import Redis from 'ioredis';
// Create a singleton Redis client (for development hot reloads)
const redis = new Redis(process.env.REDIS_URL!);

// Optional: handle events
redis.on('connect', () => {
  console.log('🟢 Redis connected');
});

redis.on('error', (err) => {
  console.error('🔴 Redis error:', err);
});


export default redis;
