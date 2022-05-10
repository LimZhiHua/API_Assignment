const api = require("../src/server");
const request = require("supertest");
var expect = require("chai").expect;

before((done) => {
  api.on("Sequelize synced", function () {
    done();
  });
});

describe("register: unspecified teacher", () => {
  it("Sends to api/register without a teacher field", async () => {
    const res = await request(api)
      .post("/api/register")
      .send({
        students: ["student0@mail.com"],
      });
    expect(res.statusCode).to.equal(400);

    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please specify a teacher and list of students",
      })
    );
  });
});

describe("register: empty student array", () => {
  it("Sends to api/register without a teacher field", async () => {
    const res = await request(api).post("/api/register").send({
      teacher: "teacher0@mail.com",
      students: [],
    });
    expect(res.statusCode).to.equal(400);

    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please specify a teacher and list of students",
      })
    );
  });
});

describe("register: unspecified students", () => {
  it("Sends to api/register without a student field", async () => {
    const res = await request(api).post("/api/register").send({
      teacher: "teacher0@mail.com",
    });
    expect(res.statusCode).to.equal(400);

    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please specify a teacher and list of students",
      })
    );
  });
});

describe("register: invalid teacher email", () => {
  it("Sends to api/register without a student field", async () => {
    const res = await request(api)
      .post("/api/register")
      .send({
        teacher: "teacher0mailcom",
        students: ["student0@mail.com"],
      });
    expect(res.statusCode).to.equal(400);

    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please ensure the teacher has a valid email",
      })
    );
  });
});

describe("register: invalid student email", () => {
  it("Sends to api/register without a student field", async () => {
    const res = await request(api)
      .post("/api/register")
      .send({
        teacher: "teacher0@mail.com",
        students: ["student0@mail.com", "studentmail.com"],
      });
    expect(res.statusCode).to.equal(400);

    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please ensure that all students have a valid email",
      })
    );
  });
});

describe("register: empty student email", () => {
  it("Sends to api/register without a student field", async () => {
    const res = await request(api).post("/api/register").send({
      teacher: "teacher0@mail.com",
      students: [],
    });
    expect(res.statusCode).to.equal(400);

    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please specify a teacher and list of students",
      })
    );
  });
});

describe("register: One teacher, one student that doesnt exist", () => {
  it("Returns status code 204 if passed", async () => {
    const res = await request(api)
      .post("/api/register")
      .send({
        teacher: "teacher0@mail.com",
        students: ["student0@mail.com"],
      });
    expect(res.statusCode).to.equal(204);

    const teachers = await request(api).get("/api/getTeachers").send();
    expect(JSON.stringify(teachers.body)).to.equal(
      JSON.stringify({
        teachers: ["teacher0@mail.com"],
      })
    );
    const students = await request(api).get("/api/getStudents").send();
    expect(JSON.stringify(students.body)).to.equal(
      JSON.stringify({
        students: [
          {
            student_email: "student0@mail.com",
            suspended: false,
          },
        ],
      })
    );
  });
});

describe("register: One teacher, multiple students that dont exist", () => {
  it("Returns status code 204 if passed", async () => {
    const res = await request(api)
      .post("/api/register")
      .send({
        teacher: "teacher0@mail.com",
        students: ["student1@mail.com", "student2@mail.com"],
      });
    expect(res.statusCode).to.equal(204);

    const teachers = await request(api).get("/api/getTeachers").send();
    expect(JSON.stringify(teachers.body)).to.equal(
      JSON.stringify({
        teachers: ["teacher0@mail.com"],
      })
    );
    const students = await request(api).get("/api/getStudents").send();
    expect(JSON.stringify(students.body)).to.equal(
      JSON.stringify({
        students: [
          {
            student_email: "student0@mail.com",
            suspended: false,
          },
          {
            student_email: "student1@mail.com",
            suspended: false,
          },
          {
            student_email: "student2@mail.com",
            suspended: false,
          },
        ],
      })
    );
  });
});

describe("register: different teacher, existing students", () => {
  it("Returns status code 204 if passed", async () => {
    const res = await request(api)
      .post("/api/register")
      .send({
        teacher: "teacher1@mail.com",
        students: ["student1@mail.com", "student2@mail.com"],
      });
    expect(res.statusCode).to.equal(204);

    const teachers = await request(api).get("/api/getTeachers").send();
    expect(JSON.stringify(teachers.body)).to.equal(
      JSON.stringify({
        teachers: ["teacher0@mail.com", "teacher1@mail.com"],
      })
    );
    const students = await request(api).get("/api/getStudents").send();
    expect(JSON.stringify(students.body)).to.equal(
      JSON.stringify({
        students: [
          {
            student_email: "student0@mail.com",
            suspended: false,
          },
          {
            student_email: "student1@mail.com",
            suspended: false,
          },
          {
            student_email: "student2@mail.com",
            suspended: false,
          },
        ],
      })
    );
  });
});

// //-------------------------/api/commonstudents-----------------------

describe("commonstudents: Empty/No teacher ", () => {
  it("Sends a call with no teachers specified", async () => {
    const res = await request(api).get("/api/commonstudents").send();
    expect(res.statusCode).to.equal(400);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please specify at least one teacher",
      })
    );
  });
});

describe("commonstudents: One teacher", () => {
  it("Sends a call with  only one teacher specified", async () => {
    const res = await request(api)
      .get("/api/commonstudents?teacher=teacher0@mail.com")
      .send();
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        students: [
          "student0@mail.com",
          "student1@mail.com",
          "student2@mail.com",
        ],
      })
    );
  });
});

describe("commonstudents: Multiple teachers", () => {
  it("Sends a call with  multiple teachers specified", async () => {
    const res = await request(api)
      .get(
        "/api/commonstudents?teacher=teacher0@mail.com&teacher=teacher1@mail.com"
      )
      .send();
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        students: ["student1@mail.com", "student2@mail.com"],
      })
    );
  });
});

describe("commonstudents: Non-Existant teachers", () => {
  it("Sends a call with a teacher that doesnt exist teacher", async () => {
    const res = await request(api)
      .get(
        "/api/commonstudents?teacher=teacher@gmail.com&teacher=teacherFAKE@mail.com"
      )
      .send();
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        students: [],
      })
    );
  });
});

//-------------------------/api/suspend-----------------------
describe("suspend: no students specified", () => {
  it("Suspending one existing student", async () => {
    const res = await request(api).post("/api/suspend").send({});
    expect(res.statusCode).to.equal(404);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please specify a student",
      })
    );
  });
});

describe("suspend: Suspend a student", () => {
  it("Suspending one existing student", async () => {
    const res = await request(api).post("/api/suspend").send({
      student: "student0@mail.com",
    });
    expect(res.statusCode).to.equal(204);

    const students = await request(api).get("/api/getStudents").send();
    expect(JSON.stringify(students.body)).to.equal(
      JSON.stringify({
        students: [
          {
            student_email: "student0@mail.com",
            suspended: true,
          },
          {
            student_email: "student1@mail.com",
            suspended: false,
          },
          {
            student_email: "student2@mail.com",
            suspended: false,
          },
        ],
      })
    );
  });
});

describe("suspend: Teacher suspends a student", () => {
  it("suspending a non-existant student", async () => {
    const res = await request(api).post("/api/suspend").send({
      student: "studentFAKE@mail.com",
    });
    expect(res.statusCode).to.equal(404);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({ message: "Student does not exist" })
    );
  });
});

//-------------------------/api/retrievefornotifications-----------------------

describe("retrievefornotifications: no notification specified", () => {
  it("Teacher sending with no notification ", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacher0@mail.com",
    });
    expect(res.statusCode).to.equal(400);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please provide a notification",
      })
    );
  });
});

describe("retrievefornotifications: no teacher specified", () => {
  it("Teacher sending with no notification ", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      notification: "here is a notifcation",
    });
    expect(res.statusCode).to.equal(400);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please provide a teacher",
      })
    );
  });
});

describe("retrievefornotifications: empty notification", () => {
  it("Teacher sending empty  notification (student0 is suspended)", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacher0@mail.com",
      notification: "",
    });
    expect(res.statusCode).to.equal(400);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        message: "Please provide a notification",
      })
    );
  });
});

describe("retrievefornotifications: meaningless notification", () => {
  it("Teacher sending  notification without any meaningful @students (remember that student0 is suspended)", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacher0@mail.com",
      notification: "here is a notification with no students",
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        recipients: ["student1@mail.com", "student2@mail.com"],
      })
    );
  });
});

describe("retrievefornotifications: teacher with notification", () => {
  it("Teacher sending notifiaction with a student", async () => {
    // adding some more students and teachers for testing
    await request(api)
      .post("/api/register")
      .send({
        teacher: "teacher2@mail.com",
        students: ["student3@mail.com", "student4@mail.com"],
      });

    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacher0@mail.com",
      notification: "notifcation for @student3@mail.com here",
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        recipients: [
          "student1@mail.com",
          "student2@mail.com",
          "student3@mail.com",
        ],
      })
    );
  });
});

describe("simple teacher", () => {
  it("Teacher sending notifiaction with a duplicate student", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacher0@mail.com",
      notification: "notifcation for @student2@mail.com here",
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        recipients: ["student1@mail.com", "student2@mail.com"],
      })
    );
  });
});

describe("retrievefornotifications: teacher", () => {
  it("Teacher sending notifiaction with a duplicate student and a new student", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacher0@mail.com",
      notification: "notifcation for @student2@mail.com @student3@mail.com",
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        recipients: [
          "student1@mail.com",
          "student2@mail.com",
          "student3@mail.com",
        ],
      })
    );
  });
});

describe("retrievefornotifications: Non-existant teacher", () => {
  it("Non-existant teacher sending notifications to students", async () => {
    const res = await request(api).post("/api/retrievefornotifications").send({
      teacher: "teacherFAKE@gmail.com",
      notification:
        "Hello students! @studentagnes@gmail.com  @studentmiche@gmail.com",
    });
    expect(res.statusCode).to.equal(200);
    expect(JSON.stringify(res.body)).to.equal(
      JSON.stringify({
        recipients: [],
      })
    );
  });
});
