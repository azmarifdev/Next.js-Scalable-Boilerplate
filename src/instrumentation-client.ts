if (process.env.NODE_ENV === "development") {
  import("react-scan")
    .then(({ scan }) => {
      scan({ enabled: true });
    })
    .catch(() => {
      // no-op in environments where scan cannot start
    });
}
