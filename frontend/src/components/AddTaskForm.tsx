import { useState } from "react";
import type { CreateTaskInput } from "../types/task";

import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  Paper,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

interface TaskRow {
  id: number;
  text: string;
  date: string;
  time: string;
}

interface Props {
  onAdd: (tasks: CreateTaskInput[]) => Promise<void>;
  error?: string | null;
}

let rc = 0;
const newRow = (): TaskRow => ({ id: ++rc, text: "", date: "", time: "" });

export default function AddTaskForm({ onAdd, error }: Props) {
  const [rows, setRows] = useState<TaskRow[]>([newRow()]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [duplicateIds, setDuplicateIds] = useState<Set<number>>(new Set());
  const [missingIds, setMissingIds] = useState<Set<number>>(new Set());

  const setField = (
    id: number,
    field: keyof Omit<TaskRow, "id">,
    val: string,
  ) =>
    setRows((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, [field]: val } : r,
      );
      setDuplicateIds(findDuplicateIds(updated));
      setMissingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return updated;
    });

  const addRow = () => setRows((prev) => [...prev, newRow()]);

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      const updated = rows.filter((r) => r.id !== id);
      setDuplicateIds(findDuplicateIds(updated));
      setMissingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setRows(updated);
    }
  };

  function findDuplicateIds(rows: TaskRow[]): Set<number> {
    const seen = new Map<string, number>();
    const dupes = new Set<number>();
    for (const row of rows) {
      if (!row.text.trim()) continue;
      const key = `${row.text.trim().toLowerCase()}||${row.time.trim()}`;
      if (seen.has(key)) {
        dupes.add(row.id);
        dupes.add(seen.get(key)!);
      } else {
        seen.set(key, row.id);
      }
    }
    return dupes;
  }

  const handleAdd = async () => {
    const filled = rows.filter((r) => r.text.trim());

    if (!filled.length) {
      setValidationError("At least one task description is required.");
      return;
    }

    const missingDateTime = filled.filter((r) => !r.date || !r.time);
    if (missingDateTime.length > 0) {
      setMissingIds(new Set(missingDateTime.map((r) => r.id)));
      setValidationError(
        missingDateTime.length === 1
          ? "Please add a date and time for the task."
          : `${missingDateTime.length} tasks are missing a date or time.`,
      );
      return;
    }

    const dupes = findDuplicateIds(filled);
    if (dupes.size > 0) {
      setDuplicateIds(dupes);
      setValidationError("Each task must have a unique description and time.");
      return;
    }

    setDuplicateIds(new Set());
    setMissingIds(new Set());
    setValidationError(null);
    setLoading(true);
    try {
      await onAdd(
        filled.map((r) => ({
          text: r.text.trim(),
          date: r.date,
          time: r.time,
          completed: false,
        })),
      );
      setRows([newRow()]);
    } finally {
      setLoading(false);
    }
  };

  const displayError = validationError ?? error;
  const isMulti = rows.length > 1;
  const filledCount = rows.filter((r) => r.text.trim()).length;

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 3,
        mb: 2,
        borderColor: "grey.200",
      }}
    >
      {/* Header */}
      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          color: "text.secondary",
          display: "block",
          mb: 2,
        }}
      >
        New Task{isMulti ? "s" : ""}
      </Typography>

      {/* Column Headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMulti
            ? "1fr 160px 140px 40px"
            : "1fr 160px 140px",
          gap: 1.5,
          mb: 1,
          px: 0.5,
        }}
      >
        {["Description", "Date", "Time"].map((label) => (
          <Typography
            key={label}
            variant="overline"
            sx={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "text.disabled",
            }}
          >
            {label}
          </Typography>
        ))}
        {isMulti && <Box />}
      </Box>

      {/* Task Rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 1.5 }}>
        {rows.map((row) => {
          const isDupe = duplicateIds.has(row.id);
          const isMissing = missingIds.has(row.id);
          const isRowError = isDupe || isMissing;

          return (
            <Box key={row.id}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMulti
                    ? "1fr 160px 140px 40px"
                    : "1fr 160px 140px",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                {/* Description */}
                <TextField
                  size="small"
                  placeholder="Enter Your Task"
                  value={row.text}
                  onChange={(e) => {
                    setField(row.id, "text", e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addRow();
                  }}
                  disabled={loading}
                  error={isRowError}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                {/* Date */}
                <TextField
                  size="small"
                  type="date"
                  value={row.date}
                  onChange={(e) => {
                    setField(row.id, "date", e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={loading}
                  error={isMissing && !row.date}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                {/* Time */}
                <TextField
                  size="small"
                  type="time"
                  value={row.time}
                  onChange={(e) => {
                    setField(row.id, "time", e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={loading}
                  error={isMissing && !row.time}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                {/* Remove Row Button */}
                {isMulti && (
                  <Tooltip title="Remove row">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1 || loading}
                        color="default"
                        sx={{
                          mt: 0.25,
                          borderRadius: 1.5,
                          "&:hover": {
                            color: "error.main",
                            bgcolor: "error.50",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>

              {/* Per-row inline error messages */}
              {isDupe && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 0.5, display: "block" }}
                >
                  Duplicate: same description + time as another row.
                </Typography>
              )}
              {isMissing && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 0.5, display: "block" }}
                >
                  {!row.date && !row.time
                    ? "Date and time are required."
                    : !row.date
                      ? "Date is required."
                      : "Time is required."}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Add Another Row */}
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={addRow}
        disabled={loading}
        sx={{
          mb: 2,
          color: "text.secondary",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.75rem",
          "&:hover": { color: "primary.main", bgcolor: "transparent" },
        }}
        disableRipple
      >
        Add another task
      </Button>

      {/* Validation / Server Error */}
      {displayError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {displayError}
        </Alert>
      )}

      {/* Footer: count chip + submit button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isMulti ? (
          <Chip
            label={`${filledCount} of ${rows.length} filled`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.7rem",
              color: "text.secondary",
              borderColor: "grey.300",
            }}
          />
        ) : (
          <Box />
        )}

        <Button
          variant="contained"
          startIcon={<PlaylistAddIcon />}
          onClick={handleAdd}
          disabled={loading || filledCount === 0 || duplicateIds.size > 0}
          disableElevation
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            bgcolor: "indigo.600",
            background: "linear-gradient(135deg, #4f46e5, #6366f1)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca, #4f46e5)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          {loading
            ? "Adding…"
            : isMulti
              ? `Add ${filledCount} Task${filledCount !== 1 ? "s" : ""}`
              : "Add Task"}
        </Button>
      </Box>
    </Paper>
  );
}
