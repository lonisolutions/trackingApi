const extractPostalAndCity = async (
  input: string
): Promise<{ postalCode: string; city: string }> => {
  const regex = /(\d+)\s([\w\s]+),\s\w+/;
  const match = regex.exec(input);

  return {
    postalCode: match?.[1] || "",
    city: match?.[2] || "",
  };
};

export { extractPostalAndCity };
