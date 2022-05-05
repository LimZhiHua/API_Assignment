const api = require('./src/controllers/apis')
const request = require('supertest');
var expect = require('chai').expect

  
api.listen(3000, () => {
    console.log("Server running on port 3000");
});


//-------------------------/api/register-----------------------
describe('One teacher, one student', () => {
    it('Returns status code 204 if passed', async () => {
        const res = await request(api).post('/api/register').send(
            {
                "teacher": "teacher@mail.com",
                "students":
                    [
                    "student3@mail.com"
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
                "teacher": "teacher@mail.com",
                "students":
                    [
                    "student0@mail.com",
                    "student2@mail.com",
                    "student3@mail.com"
                    ]
            }
        )
        expect(res.statusCode).to.equal(204)
    })
})

describe(' Different teacher, multiple students', () => {
    it('Returns status code 204 if passed', async () => {
        const res = await request(api).post('/api/register').send(
            {
                "teacher": "teacher2@mail.com",
                "students":
                    [
                        "student0@mail.com",
                        "student2@mail.com"
                    ]
            }
        )
        expect(res.statusCode).to.equal(204)
    })
})



describe('non-existant teacher, one students', () => {
    it('Returns an error saying the teacher was not found', async () => {
        const res = await request(api).post('/api/register').send(
            {
                "teacher": "teacherFAKE@mail.com",
                "students":
                    [
                    "student0@mail.com"
                    ]
            }
        )
        expect(res.statusCode).to.equal(404)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify({
            "message": "teacher 'teacherFAKE@mail.com' was not found"
        }))

    })
})


describe('One teacher, non-existant student', () => {
    it('It shouldnt insert anything, but should still return 204', async () => {
        const res = await request(api).post('/api/register').send(
            {
                "teacher": "teacher@mail.com",
                "students":
                    [
                    "student234@mail.com"
                    ]
            }
        )
        expect(res.statusCode).to.equal(204)
    })
})




//-------------------------/api/commonstudents-----------------------
describe('Empty/No teacher ', () => {
    it('Sends a call with no teachers specified', async () => {
        const res = await request(api).get('/api/commonstudents').send()
        expect(res.statusCode).to.equal(200)
    })
})

describe('One teacher ', () => {
    it('Sends a call with  only one teacher specified', async () => {
        const res = await request(api).get('/api/commonstudents?teacher=teacher@mail.com').send()
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "students": [
                    "student0@mail.com",
                    "student2@mail.com",
                    "student3@mail.com"
                ]
            }
        ))
    })
})


describe('Multiple teachers', () => {
    it('Sends a call with  multiple teachers specified', async () => {
        const res = await request(api).get('/api/commonstudents?teacher=teacher@mail.com&teacher=teacher2@mail.com').send()
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "students": [
                    "student0@mail.com",
                    "student2@mail.com"
                ]
            }
        ))
    })
})

describe('Non-Existant teachers', () => {
    it('Sends a call with a teacher that doesnt exist teacher', async () => {
        const res = await request(api).get('/api/commonstudents?teacher=teacher@gmail.com&teacher=teacherFAKE@mail.com').send()
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
               "students":[]
            }
        ))
    })
})

//-------------------------/api/suspend-----------------------
describe('Suspend a student', () => {
    it('Suspending one existing student', async () => {
        const res = await request(api).post('/api/suspend').send(
            {
                "student" : "student0@mail.com"
                }
        )
        expect(res.statusCode).to.equal(204)
    })
})

describe('Non-existant teacher suspends a student', () => {
    it('suspending a non-existant student', async () => {
        const res = await request(api).post('/api/suspend').send(
            {
                "student" : "studentFAKE@mail.com"
                }
        )
        expect(res.statusCode).to.equal(404)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            { "message": "student studentFAKE@mail.comwas not found"
            }
        ))
    })
})

//-------------------------/api/retrievefornotifications-----------------------

describe('empty notification', () => {
    it('Teacher sending empty  notification (remember that student0 is suspended)', async () => {
        const res = await request(api).post('/api/retrievefornotifications').send(
            {
                "teacher": "teacher@mail.com",
                "notification": ""
            }
        )
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "recipients": [
                    "student2@mail.com",
                    "student3@mail.com"
                ]
            }
        ))
    })
})

describe('meaningless notification', () => {
    it('Teacher sending  notification without any meaningful @students (remember that student0 is suspended)', async () => {
        const res = await request(api).post('/api/retrievefornotifications').send(
            {
                "teacher": "teacher@mail.com",
                "notification": ""
            }
        )
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "recipients": [
                    "student2@mail.com",
                    "student3@mail.com"
                ]
            }
        ))
    })
})

describe('simple teacher', () => {
    it('Teacher sending notifiaction with a student', async () => {
        const res = await request(api).post('/api/retrievefornotifications').send(
            {
                "teacher": "teacher@mail.com",
                "notification": "notifcation for @student4@mail.com here"
            }
        )
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "recipients": [
                    "student2@mail.com",
                    "student3@mail.com",
                    "student4@mail.com"
                ]
            }
        ))
    })
})

describe('simple teacher', () => {
    it('Teacher sending notifiaction with a duplicate student', async () => {
        const res = await request(api).post('/api/retrievefornotifications').send(
            {
                "teacher": "teacher@mail.com",
                "notification": "notifcation for @student3@mail.com here"
            }
        )
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "recipients": [
                    "student2@mail.com",
                    "student3@mail.com"
                ]
            }
        ))
    })
})

describe('simple teacher', () => {
    it('Teacher sending notifiaction with a duplicate student and a new student', async () => {
        const res = await request(api).post('/api/retrievefornotifications').send(
            {
                "teacher": "teacher@mail.com",
                "notification": "notifcation for @student3@mail.com @student4@mail.com"
            }
        )
        expect(res.statusCode).to.equal(200)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {
                "recipients": [
                    "student2@mail.com",
                    "student3@mail.com",
                    "student4@mail.com"
                ]
            }
        ))
    })
})


describe('Non-existant teacher', () => {
    it('Non-existant teacher sending notifications to students', async () => {
        const res = await request(api).post('/api/retrievefornotifications').send(
            {
                "teacher": "teacherFAKE@gmail.com",
                "notification": "Hello students! @studentagnes@gmail.com  @studentmiche@gmail.com"
            }
        )
        expect(res.statusCode).to.equal(404)
        expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
            {"message":"teacher 'teacherFAKE@gmail.com' was not found"}
        ))
    })
})