import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

import { Search, LocationOn } from "@mui/icons-material";

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
                backgroundColor: "#FFFDF9",
                p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                },
                borderRadius: 3,
                border: "1px solid #E9DED0",
            }}
        >
            {/* SEARCH AREA */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr auto",
                    },
                    gap: 1.5,
                    mb: 2.5,
                }}
            >
                <TextField
                    fullWidth
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
                    InputProps={{
                        startAdornment: (
                            <Search
                                sx={{
                                    color: "#E76F51",
                                    mr: 1,
                                }}
                            />
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFDF9",
                            borderRadius: 2,
                            "& fieldset": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover fieldset": {
                                borderColor: "#E76F51",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#E76F51",
                            },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#E76F51",
                        },
                    }}
                />

                <Button
                    variant="contained"
                    onClick={onSearch}
                    startIcon={<Search />}
                    sx={{
                        minWidth: {
                            xs: "100%",
                            md: 130,
                        },
                        minHeight: 56,
                        borderRadius: 2,
                        backgroundColor: "#E76F51",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 800,
                        "&:hover": {
                            backgroundColor: "#D85F43",
                        },
                    }}
                >
                    Search
                </Button>
            </Box>

            {/* FILTER LABEL */}
            <Box
                sx={{
                    mb: 1.5,
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#5F554D",
                }}
            >
                Filter results
            </Box>

            {/* FILTERS */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                }}
            >
                {/* LOCATION */}
                <TextField
                    fullWidth
                    label="Location"
                    placeholder="e.g. Accra"
                    value={location}
                    onChange={(e) =>
                        onLocationChange(e.target.value)
                    }
                    InputProps={{
                        startAdornment: (
                            <LocationOn
                                sx={{
                                    color: "#6A994E",
                                    mr: 1,
                                }}
                            />
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "& fieldset": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover fieldset": {
                                borderColor: "#6A994E",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#6A994E",
                            },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#6A994E",
                        },
                    }}
                />

                {/* JOB TYPE */}
                <FormControl fullWidth>
                    <InputLabel
                        sx={{
                            "&.Mui-focused": {
                                color: "#E76F51",
                            },
                        }}
                    >
                        Job Type
                    </InputLabel>

                    <Select
                        value={jobType}
                        label="Job Type"
                        onChange={(e) => {
                            onJobTypeChange(e.target.value);
                        }}
                        sx={{
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
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
                <FormControl fullWidth>
                    <InputLabel
                        sx={{
                            "&.Mui-focused": {
                                color: "#E76F51",
                            },
                        }}
                    >
                        Category
                    </InputLabel>

                    <Select
                        value={categoryId}
                        label="Category"
                        onChange={(e) => {
                            onCategoryChange(e.target.value);
                        }}
                        sx={{
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
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
                <FormControl fullWidth>
                    <InputLabel
                        sx={{
                            "&.Mui-focused": {
                                color: "#E76F51",
                            },
                        }}
                    >
                        Sort
                    </InputLabel>

                    <Select
                        value={sort}
                        label="Sort"
                        onChange={(e) => {
                            onSortChange(e.target.value);
                        }}
                        sx={{
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
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

            {/* CLEAR FILTERS */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                }}
            >
                <Button
                    variant="text"
                    onClick={onClear}
                    sx={{
                        color: "#7A7068",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: "#FFF1D6",
                            color: "#E76F51",
                        },
                    }}
                >
                    Clear filters
                </Button>
            </Box>
        </Box>
    );
}

export default JobFilters;