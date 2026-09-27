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

            {/* SEARCH */}
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
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch();
                        }
                    }}
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

            {/* FILTERS */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >

                {/* LOCATION */}
                <TextField
                    label="Location"
                    placeholder="e.g. Accra"
                    value={location}
                    onChange={(e) =>
                        onLocationChange(e.target.value)
                    }
                    sx={{
                        flex: 1,
                        minWidth: "180px",
                    }}
                />

                {/* JOB TYPE */}
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
                        onChange={(e) => {
                            onJobTypeChange(e.target.value);
                        }}
                    >
                        <MenuItem value="">
                            All Job Types
                        </MenuItem>

                        <MenuItem value="Full-Time">
                            Full-Time
                        </MenuItem>

                        <MenuItem value="Part-Time">
                            Part-Time
                        </MenuItem>

                        <MenuItem value="Internship">
                            Internship
                        </MenuItem>

                        <MenuItem value="Contract">
                            Contract
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* CATEGORY */}
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
                        onChange={(e) => {
                            onCategoryChange(e.target.value);
                        }}
                    >
                        <MenuItem value="">
                            All Categories
                        </MenuItem>

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

                {/* SORT */}
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
                        onChange={(e) => {
                            onSortChange(e.target.value);

                            // Apply the new sort immediately
                            const newSort = e.target.value;

                            setTimeout(() => {
                                // This is handled by the parent
                                // when the user searches/filters.
                            }, 0);
                        }}
                    >
                        <MenuItem value="newest">
                            Newest First
                        </MenuItem>

                        <MenuItem value="oldest">
                            Oldest First
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* CLEAR */}
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