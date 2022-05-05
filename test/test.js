const api = require('../server')
const request = require('supertest');
var expect = require('chai').expect

describe('One teacher, one student', () => {
    it('Returns status code 204 if passed', async () => {
        const res = await request(api).post('/api/register').send(
            {
                "teacher": "teacher0@mail.com",
                "students":
                    [
                    "student0@mail.com"
                    ]
            }
        )
        expect(res.statusCode).to.equal(204)

    })
})

describe(' One teacher, multiple students', () => {
    it('Returns status code 204 if passed', async () => {
        const res = await request(api).post('/api/register').send(
            {
                "teacher": "teacher0@mail.com",
                "students":
                    [
                    "student1@mail.com",
                    "student2@mail.com",
                    "student3@mail.com"
                    ]
            }
        )
        expect(res.statusCode).to.equal(204)
    })
})