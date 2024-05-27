const redis = require("redis");

// Create a Redis client with authentication
const client = redis.createClient({
    url: 'redis://default:Stevo@67@localhost:6379' 
});

// Connect to the Redis server
client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Error connecting to Redis:', err);
});


// Error handler for the Redis client
client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});


// Gracefully close the Redis client on SIGINT
process.on('SIGINT', () => {
    client.quit(() => {
        console.log('Redis connection closed');
        process.exit();
    });
});

const setJWT = (key, value) => {
    return new Promise((resolve, reject) => {
        if (client.isOpen) { // Check if the client is open
            client.set(key, value)
                .then(res => resolve(res))
                .catch(err => reject(err));
        } else {
            reject(new Error('Redis client is not open'));
        }
    });
};
const getJWT = (key) => {
    return new Promise((resolve, reject) => {
        if (client.isOpen) { // Check if the client is open
            client.get(key)
                .then(res => resolve(res))
                .catch(err => reject(err));
        } else {
            reject(new Error('Redis client is not open'));
        }
    });
};
const deleteJWT = (key) => {
    try {
      client.del(key);
    } catch (error) {
      console.log(error);
    }
};


module.exports = {
    setJWT,
    getJWT,
    deleteJWT,
};
