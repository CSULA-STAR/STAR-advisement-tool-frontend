import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import CourseCard from "../../components/CourseCard/index";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function BlockModal({
  data,
  block,
  handleCheckboxChange,
  enableCheckbox,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: "auto" }}>
      <Button
        onClick={handleOpen}
        style={{
          backgroundColor: "#C7C8C8",
          color: "black",
          width: 350,
          height: 80,
        }}
      >
        <strong> {block}</strong>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "90%", height: "90%" }}>
          <Button
            onClick={handleClose}
            style={{ position: "absolute", right: 10, top: 10, color: "black" }}
          >
            <CloseIcon />
          </Button>
          <Grid container spacing={2}>
            {data.map((course) => (
              <Grid
                item
                key={course._id}
                xs={12}
                sm={6}
                md={4}
                style={{ marginTop: 50 }}
              >
                <CourseCard
                  enableCheckbox
                  course={course}
                  onCheckboxChange={handleCheckboxChange}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            onClick={handleOk}
            style={{
              position: "absolute",
              right: 50,
              bottom: 50,
              color: "black",
              backgroundColor: "#eee",
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
