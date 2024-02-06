const request = require('supertest'); 
const { app, server } = require('../src/server');
const mongoose = require('mongoose');

async function getToken() {
    const res = await request(app)
        .post('/api/v1/login')
        .send({
            'username': 'test3',
            'password': 'aB1$efgh'
        });

    console.log(res.body); 

    return res.body.token;
}

describe('POST /api/v1/map', () => {
    var token;

    beforeAll( async () => { 
        await mongoose.connect(
            process.env.MONGODB_URI,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        ); 
        token = await getToken();

    });

    afterAll(async () => { 
        await mongoose.connection.close(true); 
        await new Promise((resolve) => {
            server.close(resolve);
        });
    });

    test('POST /api/v1/map Test valid input', async () => {

        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token
            })
            .send({
                lat: [0.0, 90.0],
                lng: [0.0, 180.0]
            });

        console.log(res.body.message);

        expect(res.status).toBe(200);        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Events filtered successfully");
        expect(res.body.events).toBeDefined();

    });

    test('POST /api/v1/map Test missing required fields', async () => {
        const res = await request(app)
            .post('/api/v1/map')
            .set({
                'Authorization': token,
                'Accept': 'application/json'
            })
            .send({});
        
        expect(res.status).toBe(400);         
        expect(res.body.success).toBe(false);         
        expect(res.body.message).toBe('Required fields missing in request body');    
    });

    test('POST /api/v1/map Test missing lat field', async () => {
        const res = await request(app)
            .post('/api/v1/map')
            .set({
                'Authorization': token,
                'Accept': 'application/json'
            })
            .send({
                lng: [0., 180.]
            });

        expect(res.status).toBe(400);         
        expect(res.body.success).toBe(false);         
        expect(res.body.message).toBe('Required fields missing in request body');
    });

    test('POST /api/v1/map TEST missing end_lat field', async () => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token,
                'Accept': 'application/json'
            })
            .send({
                lat: [0.0],
                lng: [0.0, 180.0],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);         
        expect(res.body.message).toBe('Provided fields are not ranges');

    });

    test('POST /api/v1/map TEST non-number field', async() => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token,
                'Accept': 'application/json'
            })
            .send({
                lat: [0.0, "string"],
                lng: [true, 100.0],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);         
        expect(res.body.message).toBe('Required fields have wrong type');

    });

    test('POST /api/v1/map TEST inconsistent', async() => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token,
                'Accept': 'application/json'
            })
            .send({
                lat: [80.0, -20.0],
                lng: [30.0, -60.0],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Provided ranges are inconsistent");
        
    });

    test('POST /api/v1/map TEST out-of-bounds', async() => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token,
                'Accept': 'application/json'
            })
            .send({
                lat: [-100.0, 100.0],
                lng: [30.0, 60.0],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Provided ranges are out of bounds");
        
    });
});

