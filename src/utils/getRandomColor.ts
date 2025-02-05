const colors = [
  "#EFEFEF",
  "#FFDEDE",
  "#FFF0DE",
  "#FFFEDE",
  "#F6FFDE",
  "#E4FFDE",
  "#DEFFF7",
  "#DEE9FF",
  "#DEF1FF",
  "#E8DEFF",
  "#F9DEFF",
  "#FFC9BF",
  "#DEFFE7",
  "#DCE0CD",
  "#EAE8D9",
  "#D5E8E7",
  "#D8DBEA",
  "#EAD3D3",
  "#CDE6C7",
  "#EDDFDF"
];

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
