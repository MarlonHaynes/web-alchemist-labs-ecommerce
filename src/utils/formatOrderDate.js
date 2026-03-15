export function formatOrderDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}