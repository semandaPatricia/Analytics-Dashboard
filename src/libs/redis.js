import { Redis } from '@upstash/redis'
  
const redis = new Redis({
  url: 'https://eu2-mutual-fawn-31584.upstash.io',
  token:process.env.REDIS_KEY ,
})
  
const data = await redis.set('foo', 'bar');