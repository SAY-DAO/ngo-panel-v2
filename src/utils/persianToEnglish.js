export function numberConvertor(string) {
  return string
    .replace(/[\u0660-\u0669]/g, (c) => {
      return c.charCodeAt(0) - 0x0660;
    })
    .replace(/[\u06f0-\u06f9]/g, (c) => {
      return c.charCodeAt(0) - 0x06f0;
    });
}

export function dateConvertor(string) {
  return new Date(string).toLocaleDateString('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
