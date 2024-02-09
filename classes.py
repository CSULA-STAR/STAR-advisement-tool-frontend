class School:
    def __init__(self, name, location):
        self.name = name
        self.location = location
        self.programs = []

    def add_program(self, program):
        self.programs.append(program)

    def list_programs(self):
        return self.programs

    def delete_program(self, program_name):
        for program in self.programs:
            if program.name == program_name:
                self.programs.remove(program)
                return True
        return False

class Program:
    def __init__(self, name, level, department, duration_years):
        self.name = name
        self.level = level
        self.department = department
        self.duration_years = duration_years
        self.courses = []
        self.articulations = []

    def add_course(self, course):
        self.courses.append(course)

    def add_articulation(self, articulation):
        self.articulations.append(articulation)

    def list_courses(self):
        return self.courses

    def list_articulations(self):
        return self.articulations

    def delete_course(self, course_code):
        for course in self.courses:
            if course.code == course_code:
                self.courses.remove(course)
                return True
        return False

class Course:
    def __init__(self, code, title, credits):
        self.code = code
        self.title = title
        self.credits = credits

class Articulation:
    def __init__(self, from_course, to_course):
        self.from_course = from_course
        self.to_course = to_course

# Usage:

# Create a School
cal_state_la = School(name="Cal State LA", location="Los Angeles")

# Create a Computer Science program
computer_science_program = Program(name="Computer Science", level="Bachelor's", department="Computer Science", duration_years=4)

# Add courses to the program
programming_course = Course(code="CS101", title="Introduction to Programming", credits=3)
database_course = Course(code="CS201", title="Database Management", credits=4)

computer_science_program.add_course(programming_course)
computer_science_program.add_course(database_course)

# Add the program to the school
cal_state_la.add_program(computer_science_program)

# Create an Articulation agreement between a community college course and Cal State LA course
community_college_course = Course(code="CC101", title="Programming Fundamentals", credits=3)

articulation_agreement = Articulation(from_course=community_college_course, to_course=programming_course)

# Add the articulation to the Computer Science program
computer_science_program.add_articulation(articulation_agreement)

# Now, the Computer Science program has a course and an articulation agreement
print(f"Program: {computer_science_program.name}")
print(f"Courses: {[course.title for course in computer_science_program.list_courses()]}")
print(f"Articulations: {[f'{a.from_course.title} -> {a.to_course.title}' for a in computer_science_program.list_articulations()]}")

# Deleting a course from the program
computer_science_program.delete_course("CS101")
print(f"After deleting course: {[course.title for course in computer_science_program.list_courses()]}")

# Deleting a program from the school
cal_state_la.delete_program("Computer Science")
print(f"After deleting program: {[program.name for program in cal_state_la.list_programs()]}")
