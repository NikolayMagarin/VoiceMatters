export const getBlob = async (url: string) => await (await fetch(url)).blob();
