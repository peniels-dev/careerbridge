import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

function JobCard({ job, onViewDetails }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 2,
        transition: "0.2s",

        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Job title */}
        <Typography
          variant="h6"
          component="h2"
          fontWeight="bold"
          gutterBottom
        >
          {job.JobTitle}
        </Typography>

        {/* Company */}
        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
        >
          🏢 {job.CompanyName || "Company not specified"}
        </Typography>

        {/* Location */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📍 {job.Location || "Location not specified"}
        </Typography>

        {/* Job type and category */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 2,
            mb: 2,
          }}
        >
          <Chip
            label={job.JobType || "Not specified"}
            size="small"
            variant="outlined"
          />

          <Chip
            label={job.CategoryName || "No category"}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Short description */}
        <Typography variant="body2" color="text.secondary">
          {job.Description
            ? job.Description.length > 120
              ? `${job.Description.substring(0, 120)}...`
              : job.Description
            : "No description available."}
        </Typography>

        {/* Application deadline */}
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            fontWeight: "bold",
          }}
        >
          Application Deadline:{" "}
          {job.ApplicationDeadline
            ? new Date(job.ApplicationDeadline).toLocaleDateString()
            : "Not specified"}
        </Typography>
      </CardContent>

      {/* View Details button */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onViewDetails(job.JobID)}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
}

export default JobCard;