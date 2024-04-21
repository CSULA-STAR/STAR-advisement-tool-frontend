{
  /* <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {courseTypes.map((header) => {
            const isGeneralEducation = header === "general_education";

            let coursesForType = isGeneralEducation
              ? genEduCourse
              : termData.filter((course) => course.course_type === header);

            const coursesToShow = isGeneralEducation
              ? blocks
                  .filter((block) =>
                    coursesForType.some((course) => course.block_type === block)
                  )
                  .map((block) => ({
                    block,
                    courses: coursesForType.filter(
                      (course) => course.block_type === block
                    ),
                  }))
              : [{ courses: coursesForType }];

            if (coursesToShow.some(({ courses }) => courses.length > 0)) {
              return (
                <div key={header}>
                  <div className="course_type">
                    <h1>{types[header]}</h1>
                  </div>
                  <Grid container spacing={5} style={{ padding: 20 }}>
                    {isGeneralEducation
                      ? coursesToShow.map(({ block, courses }) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            spacing={5}
                            key={courses._id}
                            style={{ marginLeft: -45, marginRight: 40 }}
                          >
                            <Badge
                              badgeContent={
                                <DoneOutlinedIcon
                                  fontSize="large"
                                  color="success"
                                />
                              }
                              invisible={
                                !courses.some(
                                  (course) => checkboxResponses[course._id]
                                )
                              }
                            >
                              <BlockModal
                                key={block}
                                enableCheckbox
                                data={courses}
                                block={block}
                                handleCheckboxChange={handleCheckboxChange}
                                checkboxResponses={checkboxResponses}
                              />
                            </Badge>
                          </Grid>
                        ))
                      : coursesToShow[0].courses.map((course) => {
                          const prerequisitesPresent =
                            course.pre_requisite.course_code.every(
                              (prerequisite) => {
                                return exCourses.some((selectedCourse) =>
                                  selectedCourse.course_code.includes(
                                    prerequisite
                                  )
                                );
                              }
                            );

                          return (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={4}
                              key={course._id}
                            >
                              <CourseCard
                                enableCheckbox={prerequisitesPresent}
                                requsiteRequired={!prerequisitesPresent}
                                hoverable={true}
                                course={course}
                                onCheckboxChange={(isChecked) =>
                                  handleCheckboxChange(course._id, isChecked)
                                }
                              />
                            </Grid>
                          );
                        })}
                  </Grid>
                </div>
              );
            } else {
              return null;
            }
          })}
        </Grid>
      </Box> */
}
