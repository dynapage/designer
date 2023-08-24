export const handleAddColumn = (columns, showSnackbar) => {
  if (columns.length >= 8) {
    showSnackbar("Maximum 8 columns allowed.")
    return columns
  }
  return [...columns, ""]
}

export const handleColumnNameChange = (columns, index, newValue) => {
  const newColumns = [...columns]
  newColumns[index] = newValue || ""
  return newColumns
}

export const handleDeleteColumn = (columns, index, showSnackbar) => {
  if (columns.length <= 3) {
    showSnackbar("Minimum 3 columns required.")
    return columns
  }
  const newColumns = [...columns]
  newColumns.splice(index, 1)
  return newColumns
}
