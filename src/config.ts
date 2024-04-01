const cfg = () => {
  const common = {
    dateFormat: "d MMM yyyy - HH:mm",
    tzOffset: new Date().getTimezoneOffset() / 60,
  };
  const dev = {
    baseUrl: "http://172.17.20.6:89",
  };
  const prod = {
    baseUrl: "-",
  };

  return process.env.NODE_ENV === "production"
    ? { ...prod, ...common }
    : { ...dev, ...common };
};

export default cfg();
