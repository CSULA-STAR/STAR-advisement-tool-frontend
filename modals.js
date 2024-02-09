class School {
  constructor(name, location) {
    this.name = name;
    this.location = location;
    this.programs = [];
  }

  addProgram(program) {
    this.programs.push(program);
  }
}

class Program {
  constructor(name, level, department, durationYears) {
    this.name = name;
    this.level = level;
    this.department = department;
    this.durationYears = durationYears;
    this.courses = [];
    this.articulations = [];
  }

  addCourse(course) {
    this.courses.push(course);
  }

  addArticulation(articulation) {
    this.articulations.push(articulation);
  }
}

class Course {
  constructor(code, title, credits) {
    this.code = code;
    this.title = title;
    this.credits = credits;
  }
}

class Articulation {
  constructor(fromCourse, toCourse) {
    this.fromCourse = fromCourse;
    this.toCourse = toCourse;
  }
}

// Create a School
const calStateLA = new School("Cal State LA", "Los Angeles");

// Create a Computer Science program
const computerScienceProgram = new Program(
  "Computer Science",
  "Bachelor's",
  "Computer Science",
  4
);

// Add courses to the program
const programmingCourse = new Course("CS101", "Introduction to Programming", 3);
const databaseCourse = new Course("CS201", "Database Management", 4);

computerScienceProgram.addCourse(programmingCourse);
computerScienceProgram.addCourse(databaseCourse);

// Add the program to the school
calStateLA.addProgram(computerScienceProgram);

const communityCollegeCourse = new Course(
  "CC101",
  "Programming Fundamentals",
  3
);

const articulationAgreement = new Articulation(
  communityCollegeCourse,
  programmingCourse
);

computerScienceProgram.addArticulation(articulationAgreement);

console.log(`Program: ${computerScienceProgram.name}`);
console.log(
  `Courses: ${computerScienceProgram.courses.map((course) => course.title)}`
);
console.log(
  `Articulations: ${computerScienceProgram.articulations.map(
    (a) => `${a.fromCourse.title} -> ${a.toCourse.title}`
  )}`
);
