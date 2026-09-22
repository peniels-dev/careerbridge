import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

function JobFilters({
  search,
  location,
  jobType,
  categoryId,
  sort,
  categories,
  onSearchChange,
  onLocationChange,
  onJobTypeChange,
  onCategoryChange,
  onSortChange,
  onSearch,
  onClear,
}) {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        p: 3,
        borderRadius: 3,
        boxShadow: 2,
        mb: 4,
      }}
    >
      {/* Search */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search jobs"
          placeholder="e.g. developer"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          sx={{
            flex: 1,
            minWidth: "250px",
          }}
        />

        <Button
          variant="contained"
          onClick={onSearch}
          sx={{
            minWidth: "120px",
          }}
        >
          Search
        </Button>
      </Box>

      {/* Other filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Location */}
        <TextField
          label="Location"
          placeholder="e.g. Accra"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          sx={{
            flex: 1,
            minWidth: "180px",
          }}
        />

        {/* Job Type */}
        <FormControl
          sx={{
            flex: 1,
            minWidth: "180px",
          }}
        >
          <InputLabel>Job Type</InputLabel>

          <Select
            value={jobType}
            label="Job Type"
            onChange={(e) => onJobTypeChange(e.target.value)}
          >
            <MenuItem value="">All Job Types</MenuItem>
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
        </FormControl>

        {/* Category */}
        <FormControl
          sx={{
            flex: 1,
            minWidth: "180px",
          }}
        >
          <InputLabel>Category</InputLabel>

          <Select
            value={categoryId}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category.CategoryID}
                value={category.CategoryID}
              >
                {category.CategoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl
          sx={{
            flex: 1,
            minWidth: "180px",
          }}
        >
          <InputLabel>Sort</InputLabel>

          <Select
            value={sort}
            label="Sort"
            onChange={(e) => onSortChange(e.target.value)}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Clear Filters */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClear}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
}

export default JobFilters;