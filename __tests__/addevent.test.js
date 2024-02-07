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

    test('POST /api/v1/addevent TEST valid input', async () => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token
            })
            .send({
                title: "Sample testing event",
                types: [{ name: 'Sport' }],
                location: {
                    postalCode: "38123",
                    state: "Italy",
                    city: "Trento",
                    address: "Via Sommarive",
                    houseNumber: 9,
                },
                date: "20240225T12:00:00Z",
                noUnderage: false,
                hasQR: false,
                image: "ABC",
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Event published successfully");
        expect(res.body.event).toBeDefined();
    }

    test('POST /api/v1/addevent TEST non-ISO8601 date', async () => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token
            })
            .send({
                title: "Sample testing event",
                types: [{ name: 'Sport' }],
                location: {
                    postalCode: "38123",
                    state: "Italy",
                    city: "Trento",
                    address: "Via Sommarive",
                    houseNumber: 9,
                },
                date: "non-ISO8601 string",
                noUnderage: false,
                hasQR: false,
                image: "ABC=",
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Provided 'date' field is not a ISO8601-encoded date");
    }

    test('POST /api/v1/addevent TEST non-base64 image', async () => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token
            })
            .send({
                title: "Sample testing event",
                types: [{ name: 'Sport' }],
                location: {
                    postalCode: "38123",
                    state: "Italy",
                    city: "Trento",
                    address: "Via Sommarive",
                    houseNumber: 9,
                },
                date: "20240225T12:00:00Z",
                noUnderage: false,
                hasQR: false,
                image: "samplenonb64$$$",
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Provided 'image' field is not a base64-encoded image");
    }

    test('POST /api/v1/addevent TEST non-existent location', async () => {
        const res = await request(app)
            .post("/api/v1/map")
            .set({
                'Authorization': token
            })
            .send({
                title: "Sample testing event",
                types: [{ name: 'Sport' }],
                location: {
                    postalCode: "AAAAAAAAAAAA",
                    state: "AAAAAAAAAAAA",
                    city: "AAAAAAAAAAA",
                    address: "AAAAAAAAAAAAAAAAA",
                    houseNumber: 111111111111,
                },
                date: "20240225T12:00:00Z",
                noUnderage: false,
                hasQR: false,
                image: "ABC=",
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Could not find specified address");
    }
}


